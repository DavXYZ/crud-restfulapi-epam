import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  console.log(chalk.italic(`[${new Date().toISOString()}] ${chalk.bold(req.method)} ${fullUrl}`));

  res.on('finish', () => {
    
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    let color = chalk.white; 
    if (statusCode >= 500) {
      color = chalk.red;
    } else if (statusCode >= 400) {
      color = chalk.red;
    } else if (statusCode >= 300) {
      color = chalk.blue;
    } else if (statusCode >= 200) {
      color = chalk.green;
    }

    console.log(color(`[${new Date().toISOString()}] ${chalk.bold(req.method)} ${color(fullUrl)} ${color(statusCode)} ${color(`${duration}ms`)}`));
  });

  next();
};

export default requestLogger;
