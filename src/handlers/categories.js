import grpc from '@grpc/grpc-js';
import { Categories } from "../models";

export default {
    async addCategory({ request: req }, res) {
        try {
            const category = await Categories.create({ ...req });
            if (!category) {
                res({
                    code: grpc.status.INTERNAL,
                }, null);
                return;
            }
            res(null, {
                status: 'success',
                message: 'category successfully added',
                category,
            });
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
    async getCategories({ request: req }, res) {

        try {

            let { page = 1, limit = 4 } = req;
            page = +page;
            limit = +limit;
            const offset = (page - 1) * limit;
            const total = await Categories.count();
            const totalPages = Math.ceil(total / limit);

            const categories = await Categories.findAll({ limit, offset });
            if (!categories) {
                res({
                    code: grpc.status.INTERNAL,
                }, null);
                return;
            }
            res(null, {
                status: 'success',
                page,
                limit,
                total,
                totalPages,
                categories,
            });
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
    async editCategory({ request: req }, res) {
        try {
            let parent;
            const { categoryId, category: cat, parentCategory } = req;
            const category = await Categories.findByPk(req.categoryId);
            if (req.parentCategory) {
                parent = await Categories.findOne({ where: { category: parentCategory } });
            }

            if (!category) {
                res({
                    code: grpc.status.INTERNAL,
                }, null);
                return;
            }
            category.category = req.category || category.category;
            category.parentId = parent?.id || category.parentId;
            category.save();
            res(null, {
                status: 'success',
                message: 'category successfully updated',
                category,
            });
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
    async deleteCategory({ request: req }, res) {
        try {
            const category = await Categories.findByPk(req.categoryId);
            await category?.destroy();
            console.log(category);
            res(null, { message: "api test" });
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
    async getSubcategories({ request: req }, res) {
        try {
            // limit offset
            let { page = 1, limit = 4 } = req;
            page = +page;
            limit = +limit;
            const offset = (page - 1) * limit;
            const total = await Categories.count({ where: { parentId: req.categoryId } });
            const totalPages = Math.ceil(total / limit);
            const categories = await Categories.findAll({ where: { parentId: req.categoryId }, limit, offset });
            if (!categories.length) {
                res({ code: grpc.status.NOT_FOUND })
            }
            res(null, {
                status: "success",
                page,
                limit,
                total,
                totalPages,
                categories
            })
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
    async getSingleCategory({ request: req }, res) {
        try {
            const category = await Categories.findByPk(req.categoryId);
            if (!category) {
                res({ code: grpc.status.NOT_FOUND })
            }
            res(null, {
                status: "success",
                category
            })
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },
}