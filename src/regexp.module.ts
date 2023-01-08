import { Module, DynamicModule } from '@nestjs/common';
import { RegExpService } from './regexp.service';

@Module({})
export class RegExpModule {
    static register(options: any): DynamicModule {
        return {
            module: RegExpModule,
            providers: [
                {
                    provide: RegExpService,
                    useValue: new RegExpService(),
                },
            ],
            exports: [RegExpService],
        };
    }
}
