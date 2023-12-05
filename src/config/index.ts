import 'dotenv/config';

export const dev={
    app:{
        port: process.env.SERVER_PORT,
    db: process.env.ATLAS_URL
    } ,
}