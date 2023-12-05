import 'dotenv/config';

export const dev={
    app:{
        port: process.env.PORT,
    db: process.env.MONGODB_URL
    } ,
}