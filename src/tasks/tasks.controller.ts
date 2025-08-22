import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, Logger, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {

  private readonly logger = new Logger(TasksController.name)

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`Creando nueva tarea: ${createTaskDto.tile}`)
    const result = this.tasksService.create(createTaskDto);
    this.logger.log(`Tarea creada exitosamente con ID: ${result.id}`)
    return result;
  }

  // @Get()
  // findAll() {
  //   this.logger.log(`Obteniendo todas las tareas`)
  //   const result = this.tasksService.findAll();
  //   this.logger.log(`Se encontraron ${result.length} tareas`)
  //   return result;
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const taskId = this.validateId(id);
    this.logger.log(`Buscando tarea con ID: ${taskId}`)
    return this.tasksService.findOne(taskId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const taskId = this.validateId(id);
    this.logger.log(`Actualizando tarea con ID: ${taskId}`)
    const result = this.tasksService.update(taskId, updateTaskDto);
    this.logger.log(`Tarea ${taskId} actualizada exitosamente`)
    return result;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const taskId = this.validateId(id);
    this.logger.log(`Eliminando tarea con ID: ${taskId}`)
    const result = this.tasksService.remove(taskId);
    this.logger.log(`Tarea ${taskId} eliminada exitosamente`)
    return result;
  }

  @Get()
  findAll(@Query('status') status?: string){
    this.logger.log(`Obteniendo tareas ${status ? `con status: ${status}` : '' }`)

    if(status){
      const validStatuses = ['pending', 'in-progress', 'completed']
      if(!validStatuses.includes(status)){
        throw new BadRequestException(
          `Status inválido. debe ser uno de : ${validStatuses.join(', ')} `
        )
      }
    }

    const tasks = this.tasksService.findAll(status);
    this.logger.log(`Se encontraros  ${tasks.length } tareas`)

    return tasks;
  }

  @Get('stats/summary')
  getStats(){
    this.logger.log(`Obteniendo estadisticas de tareas`);
    const stats = this.tasksService.getStats();
    return stats;
  }


  private validateId(id: string): number{
    const taskId = parseInt(id,10);

    if(isNaN(taskId) || taskId <= 0){
      this.logger.error(`ID inválido recibido: ${id}`);
      throw new BadRequestException('ID debe ser un número positivo')
    }

    return taskId;
  }

}
