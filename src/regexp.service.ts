import { Injectable } from '@nestjs/common';

@Injectable()
export class RegExpService {
    /**
     * note : regular expression functions
     */
    getUntilPathname(originalUrl: string) {
        return originalUrl.split('#')?.at(0)?.split('?').at(0) || '';
    }

    analizeUrl(url: string) {}

    /**
     * get scheme from url.
     * @param url url as string
     * @returns https, ftp, telnet, scheme, anything.
     */
    getScheme(url: string) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const schemeRegExp = RegExp('^([a-z]+)://', 'g');
        return this.getExactMatched(url.trim(), schemeRegExp);
    }

    getDomain(url: string) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const domainRegExp = RegExp('(?:\\w?://)?(?:www.)?([^/]+)', 'ig');
        return this.getExactMatched(url.trim(), domainRegExp);
    }

    getPathname(url: string) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const pathnameRegExp = RegExp('/([^?#]*)', 'ig');
        return this.getExactMatched(url.trim(), pathnameRegExp);
    }

    /**
     *
     * @param startString first string to make regexp
     * @returns
     */
    createRegExpBuilder(startString: string) {
        return new (class RegExpBuilder {
            private flag: 'g' | 'i' | 'ig' | 'm';
            private expression: string;
            constructor(initialValue: string) {
                this.expression = initialValue;
            }

            /**
             * Specifies the string that must be included before and after the current expression.
             * @param partial string to be included but not captured.
             * @param isForehead default is true. If it's false, first parameter(partial) will set after present expression
             * @returns
             */
            include(partial: string, isForehead: boolean = true) {
                if (isForehead) {
                    this.expression = this.lookbehind(partial, this.expression);
                } else {
                    this.expression = this.lookaround(this.expression, partial);
                }

                return this;
            }

            /**
             * Generates a regular expression instance based on what has been set up so far.
             * @returns RegExp (default flag is 'ig')
             */
            getOne() {
                const flag = this.flag ?? 'ig';
                return new RegExp(this.expression, 'ig');
            }

            /**
             * @param first string (to catch)
             * @param second lookaround(?=) string
             * @return `(${first})(${symbol}(${second}))`
             */
            private lookaround(first: string, second: string) {
                const symbol = '?=';
                return `(${first})(${symbol}(${second}))`;
            }

            /**
             * @param first lookbehind(?<=) string
             * @param second string (to catch)
             * @returns `(${symbol}(${first}))(${second})`
             */
            private lookbehind(first: string, second: string) {
                const symbol = '?<=';
                return `(${symbol}(${first}))(${second})`;
            }
        })(startString);
    }

    private getExactMatched(str: string, regExp: RegExp) {
        /**
         * example regexp : /\/([^?#]*)/gi
         * example input  : 'www.example.com/abcd/efg?q1=a&q2=b'
         *
         * [
         *      [
         *          '/abcd/efg',                                    // matched string but include non-capturing groups
         *          'abcd/efg',                                     // here! this is exact matched!
         *          index: 15,
         *          input: 'www.example.com/abcd/efg?q1=a&q2=b',
         *          groups: undefined
         *      ]
         *
         * ]
         */

        return [...str.matchAll(regExp)].at(0)?.at(1) ?? null;
    }
}
