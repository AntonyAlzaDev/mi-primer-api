import { IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty({ message: 'El título es obligatorio' })
    @IsString({ message: 'El título debe ser un texto' })
    @MinLength(3, {message:'El título debe tener al menos 3 caracteres'})
    @MaxLength(100, {message:'El título no puede exceder 100 caracteres'})
    tile: string;

    @IsString({message:'La descripción debe ser un texto'})
    @MaxLength(500, {message:'La descripción no puede exceder 500 caracteres'})
    description: string;

    @IsIn(['pending','in-progress','completed'],
        {message:'E status debe ser: pending, in-progress o completed'}
    )
    status: 'pending' | 'in-progress' | 'completed';
}
