export class CreateTaskDto {
    tile: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}
