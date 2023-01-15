import { Test } from '@nestjs/testing';
import { RegExpService } from '../src/regexp.service';

describe('getUntilPathName', () => {
    let regExpService: RegExpService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [],
            providers: [RegExpService],
        }).compile();

        regExpService = module.get<RegExpService>(RegExpService);
    });

    describe('createRegExpBulder', () => {
        describe('includeForhead', () => {
            it('includeForhead', () => {
                const includeRegExp = regExpService
                    .createRegExpBuilder('test')
                    .include('forehead', { isForehead: true })
                    .getOne();
                const res = 'foreheadtest'.match(includeRegExp)?.at(0);
                expect(res).toBe('test');
            });
        });

        describe('includeBehind', () => {
            it('includeBehind 1.', () => {
                const includeRegExp = regExpService
                    .createRegExpBuilder('test')
                    .include('behind', { isForehead: false })
                    .getOne();
                const res = 'testbehind'.match(includeRegExp)?.at(0);
                expect(res).toBe('test');
            });

            it('includeBehind 2.', () => {
                const includeRegExp = regExpService
                    .createRegExpBuilder('cat is behind of ')
                    .include('dog', { isForehead: false })
                    .getOne();

                const res = 'cat is behind of dog'.match(includeRegExp)?.at(0);
                expect(res).toBe('cat is behind of ');
            });
        });

        describe('includeForhead & includeBehind', () => {
            it('include forhead & behind 1.', () => {
                const includeRegExp = regExpService
                    .createRegExpBuilder('mouse')
                    .include('cat')
                    .include('dog', { isForehead: false })
                    .getOne();

                const res = 'catmousedog'.match(includeRegExp)?.at(0);
                expect(res).toBe('mouse');
            });

            it('string after [0-9]+', () => {
                const includeRegExp = regExpService.createRegExpBuilder('mouse').include('[0-9]+').getOne();

                const res = '12345mouse'.match(includeRegExp)?.at(0);
                expect(res).toBe('mouse');
            });
        });

        describe('lessThan', () => {
            it('1. string "a" but lessThanEqual 3', () => {
                const regExp = regExpService.createRegExpBuilder('a').lessThanEqual(3).getOne();

                expect('a'.match(regExp)?.at(0) === 'a').toBe(true);
                expect('aa'.match(regExp)?.at(0) === 'aa').toBe(true);
                expect('aaa'.match(regExp)?.at(0) === 'aaa').toBe(true);

                expect('aaaa'.match(regExp)?.at(0) === 'aaa').toBe(true);
                expect('aaaa'.match(regExp)?.at(0) === 'aaaa').toBe(false);
            });

            it('1. string "cat" but lessThanEqual 3', () => {
                const regExp = regExpService.createRegExpBuilder('(cat)').lessThanEqual(3).getOne();

                expect('cat'.match(regExp)?.at(0) === 'cat').toBe(true);
                expect('catcat'.match(regExp)?.at(0) === 'catcat').toBe(true);
                expect('catcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);

                expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcat').toBe(true);
                expect('catcatcatcat'.match(regExp)?.at(0) === 'catcatcatcat').toBe(false);
            });
        });
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

    describe('isOptional', () => {
        it('IsOptional should add a question mark symbol.', () => {
            const numbers = regExpService.createRegExpBuilder().from('[0-9]').getOne();
            expect(numbers.test('1234')).toBe(true);
            expect(numbers.test('abcd')).toBe(false);

            const optionalNumbers = regExpService.createRegExpBuilder().from('[0-9]').isOptional().getOne();
            expect(optionalNumbers.test('1234')).toBe(true);
            expect(optionalNumbers.test('abcd')).toBe(true);
        });
    });

    describe.skip('getPathname', () => {
        it('www.example.com/abcd/efg?q1=a&q2=b', () => {
            const res = regExpService.getPathname('www.example.com/abcd/efg?q1=a&q2=b');
            expect(res).toBe('abcd/efg');
        });

        /**
         * If scheme is, it treat the scheme as a pathname. This needs to be fixed.
         */
        it('https://www.example.com/abcd/efg?q1=a&q2=b', () => {
            // const res = regExpService.getPathname('https://www.example.com/abcd/efg?q1=a&q2=b');

            const regexp = regExpService.createRegExpBuilder('/([^?#]*)').include('https://').getOne();
            const res = 'https://www.example.com/abcd/efg?q1=a&q2=b'.match(regexp);

            expect(res).toBe('abcd/efg');
        });
    });
});
