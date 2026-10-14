import { Request, Response } from 'express';
import crypto from 'crypto';
import { NewsletterSubscriberModel } from '../models/NewsletterSubscriber.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export async function subscribe(req: Request, res: Response) {
  const { email, consent, source } = req.body;

  if (!email || !consent) {
    sendError(res, 'Valid email and consent are required', 400, 'INVALID_INPUT');
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if subscriber exists
  let subscriber = await NewsletterSubscriberModel.findOne({ email: normalizedEmail });

  if (subscriber) {
    if (subscriber.status === 'subscribed') {
      // Return success gracefully without exposing private details
      sendSuccess(res, {
        message: 'Thank you! You are already subscribed to the GAMEPULSE briefing.',
        status: 'already_subscribed',
      });
      return;
    }

    // Re-activate if previously unsubscribed
    subscriber.status = 'subscribed';
    subscriber.consentTimestamp = new Date();
    await subscriber.save();

    logger.info('Newsletter subscriber reactivated', { email: normalizedEmail });
    sendSuccess(res, {
      message: 'Welcome back! Your subscription to the GAMEPULSE briefing has been renewed.',
      status: 'reactivated',
    });
    return;
  }

  // Generate secure unsubscribe token hash
  const rawToken = crypto.randomBytes(32).toString('hex');
  const unsubscribeTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  subscriber = await NewsletterSubscriberModel.create({
    email: normalizedEmail,
    status: 'subscribed',
    consentTimestamp: new Date(),
    unsubscribeTokenHash,
    source: source || 'website_footer',
  });

  logger.info('New newsletter subscriber registered', { email: normalizedEmail, source });

  sendSuccess(res, {
    message: 'Thank you for subscribing to GAMEPULSE! Your subscription is active.',
    status: 'subscribed',
  }, 201);
}

export async function unsubscribe(req: Request, res: Response) {
  const token = (req.query.token as string || '').trim();

  if (!token) {
    sendError(res, 'Invalid or missing unsubscribe token', 400, 'INVALID_TOKEN');
    return;
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const subscriber = await NewsletterSubscriberModel.findOne({ unsubscribeTokenHash: tokenHash });

  if (!subscriber) {
    sendError(res, 'Subscriber record not found or already unsubscribed', 404, 'NOT_FOUND');
    return;
  }

  subscriber.status = 'unsubscribed';
  await subscriber.save();

  logger.info('Newsletter subscriber unsubscribed', { email: subscriber.email });

  sendSuccess(res, {
    message: 'You have been successfully unsubscribed from GAMEPULSE emails.',
    status: 'unsubscribed',
  });
}
