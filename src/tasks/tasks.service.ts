import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      name: dto.name,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      status: dto.status,
      priority: dto.priority,
      isActive: dto.isActive ?? true,
    });
    return this.taskRepository.save(task);
  }

  async findAll(query: QueryTaskDto): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, status, priority, isActive } = query;

    const where: FindOptionsWhere<Task> = {};
    if (search) where.name = ILike(`%${search}%`);
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (typeof isActive === 'boolean') where.isActive = isActive;

    const [data, total] = await this.taskRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (dto.name !== undefined) task.name = dto.name;
    if (dto.dueDate !== undefined) task.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.isActive !== undefined) task.isActive = dto.isActive;
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('Task not found');
  }
}


