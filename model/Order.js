const mongoose = require('mongoose');
const {Schema} = mongoose;

const paymentMethods = {
    value:['card','cash'],
    message: 'enum validator failed for payment Methods'
}
const orderSchema = new Schema(
    {
        items: {
            type:[Schema.Types.Mixed],
            required: true,  //at least one item should be added to the cart before placing an
        },
        totalAmount:{ 
          type:Number,
        },
        totalItems:{
            type: Number,
        },
        paymentMethods:{
            type: Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        paymentStatus:{
            type:String,
            default:'pending'
        },
        selectedAddress:{
            type: Schema.Types.Mixed,
            required:true
        },
    },
    {timestamps:true}
);

exports.Order = mongoose.model('Order',orderSchema);