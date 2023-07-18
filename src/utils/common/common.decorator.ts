import { registerDecorator, ValidationArguments } from 'class-validator';

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
