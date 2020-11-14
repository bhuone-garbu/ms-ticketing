import { BadRequestError, NotAuthorized, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@bhuone/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = Router();

router.post('/api/payments', requireAuth,
  [
    body('stripToken')
      .not()
      .isEmpty()
      .withMessage('stripToken field is required'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('orderId field is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { stripToken, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorized();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Order already cancelled');

    res.send({ success: true });
  });

export { router as newPaymentRouter };
