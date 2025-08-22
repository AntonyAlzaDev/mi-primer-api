import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola, esta es mi primera aplicación en NestJS!';
  }


  getInfo(): string{
    return 'Esta aplicación fue creada durante el Bootcamp DMC 2025';
  }

  getStatus(): object {
    return{
      status: 'runnig',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      node_version: process.version,
      message: 'API funcionando correctamente'
    }
  }

}
