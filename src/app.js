import path from 'path';
import './bin/migrate';

import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import handlers from './handlers';


const port = process.env.BOOKS_PORT || 4001;


const packageDefiniton = protoLoader.loadSync(
    path.resolve('src/protos/books.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
);

const { books } = grpc.loadPackageDefinition(packageDefiniton);

(function () {
    const server = new grpc.Server();
    server.addService(books.Books.service, handlers);
    server.bindAsync(
        `0.0.0.0:${port}`,
        grpc.ServerCredentials.createInsecure(),
        () => {
            server.start();
            console.log(`0.0.0.0:${port}: service-books started`);
        },
    );
})();




