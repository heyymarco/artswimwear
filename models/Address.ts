import { Schema } from 'mongoose'



export const addressSchema = new Schema({
    firstName : { type: String , required: true  },
    lastName  : { type: String , required: true  },
    
    phone     : { type: String , required: true  },
    email     : { type: String , required: true  },
    
    address   : { type: String , required: true  },
    city      : { type: String , required: true  },
    zone      : { type: String , required: true  },
    zip       : { type: String , required: false },
    country   : { type: String , required: true  },
});
