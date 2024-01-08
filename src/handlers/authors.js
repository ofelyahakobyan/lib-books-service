import grpc from '@grpc/grpc-js';
import {Authors, Books} from "../models";
import sequelize from "../services/sequelize";

export default {
  async getAuthorSingle({request: req}, res) {
    try {
      const author = await Authors.findByPk(req.authorId);
      if (!author) {
        res({code: grpc.status.NOT_FOUND})
      }
      res(null, {
        status: "success",
        author
      })
    } catch (e) {
      res({
        code: grpc.status.INTERNAL,
        details: e.message
      });
    }
  },
  async getAuthorsList({request: req}, res) {
    try {
      let {page = 1, limit = 4} = req;
      page = +page;
      limit = +limit;
      const offset = (page - 1) * limit;
      const total = await Authors.count();
      const totalPages = Math.ceil(total / limit);
      const authors = await Authors.findAll({
        include: [
          {
            model: Books,
            as: 'books',
            attributes: [],
          },
        ],
        attributes: {
          include: [[sequelize.literal(`COUNT(books.id)`), 'totalBooks']]
        },
        raw: true,
        nest: true,
        group: ['authors.id'],
        limit,
        offset,
        subQuery: false,
      });

      if (!authors) {
        res({
          code: grpc.status.INTERNAL,
        });
        return;
      }
      res(null, {
        status: 'success',
        page,
        limit,
        total,
        totalPages,
        authors
      });
    } catch (e) {
      res({
        code: grpc.status.INTERNAL,
        details: e.message
      });
    }
  },
  async addAuthor({request: req}, res) {
    try {
      const {firstName, lastName=null, dob=null, bio=null, avatar=null} = req;
      let smallAvatar=null;
       const author = await Authors.create({firstName, lastName, dob, bio, avatar, smallAvatar});
      if(!author){
        res({
          code:grpc.status.NOT_FOUND
        })
      }
      res(null, {
        status:  'success',
        message: 'new author successfully added',
        author,
      });
    }
    catch (e) {
      res({
        code: grpc.status.INTERNAL,
        details: e.message
      });
    }
  },

  //deleteAuthor
  // async deleteAuthor({request:req}, )
}