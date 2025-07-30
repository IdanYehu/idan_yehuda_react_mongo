import app from './app.js';
import {port} from './config/index.js';
import {connectToDatabase} from './config/db.js'




app.listen(port, async  () => {
    try {
        console.log(`Starting server on port ${port}`);
        console.log(`Connecting to database...`);
        await  connectToDatabase();
        console.log(`Server running on http://localhost:${port}`);
    }catch(e) {
        console.log(e);
    }
})







