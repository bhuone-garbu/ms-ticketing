import { requireAuth, validateRequest } from '@bhuone/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

const router = Router();

router.post('/api/payments', requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('token2 is required'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('orderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({ success: true });
  });

export { router as newPaymentRouter };
