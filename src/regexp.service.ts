import { Injectable } from '@nestjs/common';

@Injectable()
export class RegExpService {
    constructor() {}

    /**
     * note : regular expression functions
     */
    async getUntilPathname( originalUrl:string) {
        return originalUrl.split('#')?.at(0)?.split('?').at(0) || '';
    }
}
