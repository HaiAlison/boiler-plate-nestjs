import { registerDecorator, ValidationArguments } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function AsIntDefaultValue(defaultValue?: number) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'asInt',
      target: object.constructor,
      propertyName,
      validator: {
        defaultMessage(): string {
          return `${propertyName} must be a number`;
        },
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'string') {
            value = Number(value);
          }
          if (!Number.isInteger(value) && typeof value === 'number') {
            return false;
          }
          if (!value) {
            value = defaultValue;
          }
          (args.object as any)[args.property] = args.value = value;
          return true;
        },
      },
    });
  };
}

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const user = context.getArgs();
    return user[0]?.user?.[data || 'id'] ?? null; //get data or id
  },
);
