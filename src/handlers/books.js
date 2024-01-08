import grpc from '@grpc/grpc-js';
import { Books, Authors, Reviews, BookCategories, Categories, Languages } from "../models";
import sequelize from '../services/sequelize';

export default {

    // ===== TODO  HANDLERS  FOR  BOOKS =============

    async getBooksList({request:req }, res) {
        try {
          let { page = 1, limit = 9 } = req;
          const {
            minPrice = 0,
            maxPrice = 9999999,
            rating = null,
            format = [],
            languages = [],
            authorIds = [],
            popular = null,
            brandNew = null,
            bestseller = null,
            q = null,
            categoryIds = [],
          } = req;

          const initialConditions = {
            status: { $not: 'unavailable' },
            price: {
              $and: {
                $gte: minPrice,
                $lte: maxPrice,
              },
            },
          };
          let itemsByCategories = [];
          const where = initialConditions;
          if (format.includes('text')) {
            where.audio = false;
          }
          if (format.includes('audio')) {
            where.audio = true;
          }
          if (format.includes('text') && format.includes('audio')) {
            where.audio = { $or: [true, false] };
          }

          if (languages.length) {
            where.lang = { $or: [languages] };
          }
          if (authorIds.length) {
            where.authorId = { $or: [authorIds] };
          }
          if (categoryIds.length) {
            const items = await BookCategories.findAll({
              where: { categoryId: { $or: [categoryIds] } },
              raw: true,
            });
            itemsByCategories = items.map((item) => item.bookId);
          }
          if (popular) {
            where.popular = true;
          }
          if (brandNew) {
            where.new = true;
          }
          if (bestseller) {
            where.bestseller = true;
          }
          const mask = { $iLike: `%${q}%` };
          if (q) {
            let itemsByCategories=[];
            let id=null;
            const cats = await Categories.findOne({ where: { category: { $iLike: `%${q}%` } },raw:true });
            if (cats && !categoryIds.length) {
              const items = await BookCategories.findAll({ where: { categoryId: cats.id }, raw: true });
              itemsByCategories = items.map((item) => item.bookId);
            }
            where.$or = [
              { title: mask },
              { description: mask },
              { lang: mask },
              {id:{$in:itemsByCategories}},
              { '$author.firstName$': mask },
              { '$author.lastName$': mask },
            ];
          }

          page = +page;
          limit = +limit;
          const offset = (page - 1) * limit;

          const books = await Books.findAll({
            attributes: {
              exclude: [
                'createdAt',
                'updatedAt',
                'publisherId',
              ],
              include: [
                [
                  sequelize.literal(
                    '(select count(*) from reviews where "bookId"=books.id)',
                  ),
                  'totalReviews',
                ],
                [
                  sequelize.literal(
                    '(select ceil(avg(rating)) as avg from reviews where "bookId"=books.id )',
                  ),
                  'averageRating',
                ],
              ]
            },
            include: [
              {
                model: Authors,
                as: 'author',
                attributes: { exclude: ['bio', 'dob', 'createdAt', 'updatedAt'] },
              },
              {
                model: Categories,
                as: 'categories',
                where: categoryIds.length ? { id: { $or: [categoryIds] } } : { },
                required: !!categoryIds.length,
                through: { attributes: [] },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
              {
                model: Reviews,
                attributes: [],
                as: 'reviews',
                where: rating
                  ? sequelize.where(sequelize.literal('(select ceil(avg(rating)) from reviews group by bookId having bookId=books.id )'), { $eq: rating })
                  : {},
                required: !!rating,
              },
            ],
            where,
            group: ['books.id', 'author.id', 'categories.id'],
            limit,
            offset,
            subQuery:false,
            nest:true,
            raw:true,
          });
          const total = await Books.count({
            include: [
              {
                model: Authors,
                as: 'author',
                required: true,
                attributes: { exclude: ['bio', 'dob', 'createdAt', 'updatedAt'], include:['firstName'] },
              },
            ],
            where,
          });

            res(null, {
              status: 'success',
              currentPage: page,
              totalPages: Math.ceil(total / limit),
              limit,
              total,
              books,
            });
        }
        catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
    async getSingleBook({request:req}, res){
     try {
         const {bookId} =req;

       const book = await Books.findByPk(bookId, {
         attributes: {
           exclude: [
             'createdAt',
             'updatedAt',
             'publisherId',
           ],
           include: [
             [
               sequelize.literal(
                 '(select count(*) from reviews where "bookId"=books.id)',
               ),
               'totalReviews',
             ],
             [
               sequelize.literal(
                 '(select ceil(avg(rating)) as avg from reviews where "bookId"=books.id )',
               ),
               'averageRating',
             ],
           ]
         },
         include: [
           {
             model: Authors,
             as: 'author',
             attributes: { exclude: ['bio', 'dob', 'createdAt', 'updatedAt'] },
           },
           {
             model: Reviews,
             attributes: [],
             as: 'reviews',
           },
         ],
         group: ['books.id', 'author.id'],
         subQuery:false,
         nest:true,
         raw:true,
       });
       if (!book) {
         res({
           code: grpc.status.NOT_FOUND,
         }, null);
         return;
       }
       res(null, {
         status: 'success',
         book,
       });
     }
     catch (e) {
       res({
         code: grpc.status.INTERNAL,
         details: e.message
       });
     }
   },
    async addBook({request:req}, res){
    try {
      const {
         title,
         price,
         description=null,
         authorId,
         languageId,
         audio=false,
         brandNew=false,
         bestseller=false,
         popular=false,
         status='available',
         categories
      } = req;

      const lang = await Languages.findByPk(languageId);
      const author = await Authors.findByPk(authorId);
      const existingCategories = await Categories.findAll({ where: { id: { $or: [categories] } } });
      if(!lang || !author || !existingCategories.length){
        res({
          code: grpc.status.NOT_FOUND,
        }, null);
        return;
      };

      const book = await Books.create({
        title, authorId,  price,  description,  languageId, audio, status, new:brandNew, bestseller, popular
      });
      if (!book) {
        res({
          code: grpc.status.INTERNAL,
        }, null);
        return;
      }
      res(null, {
        status: 'success',
        book,
      });
    }
    catch (e) {
      res({
        code: grpc.status.INTERNAL,
        details: e.message
      });
    }
  },

  // TODO addSheetReq
    async addSheet({request:req}, res){
    try {
       // TODO get all fields that are required
        console.log(req, 77);
      //
      const sheets = req.sheets.map(s=>{return {...s, categories:undefined}});
       const books = await Books.bulkCreate(sheets);
       console.log(books, 222);
      // if (!book) {
      //   res({
      //     code: grpc.status.INTERNAL,
      //   }, null);
      //   return;
      // }
      res(null, {
        status: 'success',
      });
    }
    catch (e) {
      res({
        code: grpc.status.INTERNAL,
        details: e.message
      });
    }
  },

  //   async exportToSheet({request:req}, res){
  //   try {
  //     const {limit=100, page=1} = req;
  //     const offset = (page-1)*limit;
  //     const sheets =  await Books.findAll({raw:true, limit, offset});
  //     res(null, {
  //       sheets
  //     });
  //   }
  //   catch (e) {
  //     res({
  //       code: grpc.status.INTERNAL,
  //       details: e.message
  //     });
  //   }
  // },

    async getBooksSheet({request:req }, res) {
    try {
      // TODO
      //  1. get request  from admin user (authentification is required)
      //  2. get books data (title, price, desc) from database
      //  3. convert that data into excel sheet
      //  4. return that file with grpc stream to the route
      //  5. return that file with node stream to the client

      const books = await Books.findAll({
        attributes: {
          include: [
            'title',
            'price',
            'description',
          ],
      }});
      res(null, {
        status: 'success',
        books,
      });
    }
    catch (e) {
      res({
        code: grpc.status.INTERNAL,
        details: e.message
      });
    }
  },
}