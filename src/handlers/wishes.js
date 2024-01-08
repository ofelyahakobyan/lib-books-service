import grpc from '@grpc/grpc-js';
import { Wishes } from "../models";

export default {
    // ===== TODO  HANDLERS  FOR  BOOKS =============
    async getWishlistItems({ request: req }, res) {
        try {
            const { userId } = req;
            const items = await Wishes.findAll({ where: { userId } });
            res(null, {
                status: 'success',
                items,
            });
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    },

    async addWishlistItem({ request: req }, res) {
        try {
            const { userId, bookId } = req;
            //TODO:  validate User by sending request to user-service

            const validBook = await Books.findByPk({ bookId });
            if (!validBook) {
                res({
                    code: grpc.status.NOT_FOUND,
                    details: 'a book with that id does not exist'
                })
            }
            const item = await Wishes.create({ userId, bookId });
            res(null, {
                status: 'success',
                message: 'item succesfully added to your wishlist',
                item,
            });
        } catch (e) {
            res({
                code: grpc.status.INTERNAL,
                details: e.message
            });
        }
    }
}