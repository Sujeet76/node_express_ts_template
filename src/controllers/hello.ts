import { logger } from '../logger/logger';
import { asyncHandler } from '../utils/async-handler';

export class HelloController {
  public hello = asyncHandler(async (req, res) => {
    // Log using both the logger and direct file writing
    logger.info('Hello world endpoint hit');

    res.status(200).json({
      message: 'Hello, World!',
    });
  });
}
