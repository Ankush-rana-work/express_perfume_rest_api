import CommonHelper from '../../utils/commonHelper.js';
import Message from '../../local/message.js';
import HomeService from '../service/homeService.js';

const { sendError, sendSucess } = CommonHelper;
const HomeController = {
  newArrival: async (req, res, next) => {
    try {
      const user = await HomeService.newArrival(req.body);
      sendSucess(res, 200, Message.USER_LIST, user);
    } catch (error) {
      next(error);
    }
  },
  bestSeller: async (req, res, next) => {
    try {
      const user = await HomeService.bestSeller(req.body);
      sendSucess(res, 200, Message.USER_LOGGED_IN, user);
    } catch (error) {
      next(error);
    }
  },
  topCategory: async(req, res, next) => {
    try {
      const user = await HomeService.topCategory(req.body);
      sendSucess(res, 200, Message.USER_LOGGED_IN, user);
    } catch (error) {
      next(error);
    }
  }
};

export default HomeController;
