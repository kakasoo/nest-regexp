import { Test } from '@nestjs/testing';
import { RegExpService } from '../regexp.service';

describe('getUntilPathName', () => {
    let regExpService: RegExpService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [],
            providers: [RegExpService],
        }).compile();

        regExpService = module.get<RegExpService>(RegExpService);
    });

    it('should be 1', () => {
        expect(1).toBe(1);
    });

    describe('getScheme', () => {
        it('https://', () => {
            const res = regExpService.getScheme('https://example.com');
            expect(res).toBe('https');
        });

        it('file://', () => {
            const res = regExpService.getScheme('file://example.com');
            expect(res).toBe('file');
        });

        it('ftp://', () => {
            const res = regExpService.getScheme('ftp://example.com');
            expect(res).toBe('ftp');
        });

        it('telnet://', () => {
            const res = regExpService.getScheme('telnet://example.com');
            expect(res).toBe('telnet');
        });

        it('If scheme is followed by a space character', () => {
            const res = regExpService.getScheme(' https://example.com');
            expect(res).toBe('https');
        });
    });

    describe('getDomain', () => {
        it('www.example.com', () => {
            const res = regExpService.getDomain('www.example.com');
            expect(res).toBe('example.com');
        });
    });

    describe('getPathname', () => {
        it('www.example.com/abcd/efg?q1=a&q2=b', () => {
            const res = regExpService.getPathname('www.example.com/abcd/efg?q1=a&q2=b');
            expect(res).toBe('abcd/efg');
        });

        /**
         * If scheme is, it treat the scheme as a pathname. This needs to be fixed.
         */
        it('https://www.example.com/abcd/efg?q1=a&q2=b', () => {
            const res = regExpService.getPathname('https://www.example.com/abcd/efg?q1=a&q2=b');
            expect(res).toBe('abcd/efg');
        });
    });
});
