import Stripe from "stripe";
import config from "../../config/index.js";
import CommonHelper from "../../utils/commonHelper.js";
import StripeWebhookService from "../service/stripeWebhookService.js";

const { STRIPE } = config;
const { sendSucess } = CommonHelper;
const stripeInstance = Stripe(STRIPE.SECRETE_KEY);
const endpointSecret = "whsec_cb0cdc9e195713ab641acb68104851cecc7d0546100f2d471964aafb4e098dd7";

const stripeWebhookController = {
    updateOrder: async (req, res, next) => {
        try {
            const sig = req.headers['stripe-signature'];
            let event;
            try {
                event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
            } catch (err) {
                next(err);
                return;
            }
            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    StripeWebhookService.updatedOrder(event, 'success');
                    break;
                case 'payment_intent.payment_failed':
                    StripeWebhookService.updatedOrder(event, 'fail');
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            console.log(event);
            sendSucess(res, 200, "workin", event);
        } catch (error) {
            next(error);
        }
    },
}



export default stripeWebhookController;