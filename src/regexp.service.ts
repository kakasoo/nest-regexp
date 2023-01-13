import { Injectable } from '@nestjs/common';

@Injectable()
export class RegExpService {
    /**
     * note : regular expression functions
     */
    getUntilPathname(originalUrl: string) {
        return originalUrl.split('#')?.at(0)?.split('?').at(0) || '';
    }

    analizeUrl(url: string): { scheme: string; domain: string; pathname: string; queryString: string } {
        return {
            scheme: this.getScheme(url) || null,
            domain: this.getDomain(url) || null,
            pathname: this.getPathname(url) || null,
            queryString: '', // TODO
        };
    }

    /**
     * get scheme from url.
     * @param url url as string
     * @returns https, ftp, telnet, scheme, anything.
     */
    getScheme(url: string): string {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const schemeRegExp = RegExp('^([a-z]+)://', 'g');
        return this.getExactMatched(url.trim(), schemeRegExp);
    }

    getDomain(url: string): string {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const domainRegExp = RegExp('(?:\\w?://)?(?:www.)?([^/]+)', 'ig');
        return this.getExactMatched(url.trim(), domainRegExp);
    }

    getPathname(url: string): string {
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
    createRegExpBuilder(startString?: string) {
        return new (class RegExpBuilder {
            private flag: 'g' | 'i' | 'ig' | 'm';
            private expression: string;
            private minimum?: number = null;
            private maximum?: number = null;
            constructor(initialValue: string = '') {
                this.expression = initialValue;
            }

            from(initialValue: string) {
                this.expression = initialValue;
                return this;
            }

            /**
             *
             * @param partial sub-regular expression builder that returns a string
             * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
             */
            include(partial: (qb: RegExpBuilder) => string, options?: { isForehead?: boolean }): this;

            /**
             * Specifies the string that must be included before and after the current expression.
             * @param partial string to be included but not captured.
             * @param options isForehead's default is true. If it's false, first parameter(partial) will set after present expression
             * @returns
             */
            include(partial: string, options?: { isForehead?: boolean }): this;
            include(
                partial: string | ((qb: RegExpBuilder) => string),
                options: { isForehead?: boolean } = { isForehead: true },
            ) {
                if (typeof partial === 'string') {
                    if (options.isForehead) {
                        this.expression = this.lookbehind(partial, this.expression);
                    } else {
                        this.expression = this.lookaround(this.expression, partial);
                    }
                    return this;
                } else if (typeof partial === 'function') {
                    const subRegExp = partial(new RegExpBuilder());

                    if (options.isForehead) {
                        this.expression = this.lookbehind(subRegExp, this.expression);
                    } else {
                        this.expression = this.lookaround(this.expression, subRegExp);
                    }
                    return this;
                }
            }

            lessThanEqual(maximum: number) {
                this.maximum = maximum;
                return this;
            }

            /**
             * Generates a regular expression instance based on what has been set up so far.
             * @returns RegExp (default flag is 'ig')
             */
            getOne(): RegExp {
                const flag = this.flag ?? 'ig';
                return new RegExp(this.getRawOne(), 'ig');
            }

            getRawOne(): string {
                let expression = this.expression;
                if (typeof this.minimum === 'number' && typeof this.maximum === 'number') {
                    // more than equal minimum, less thean equal maximum
                    expression = `${expression}{${this.minimum}, ${this.maximum}}`;
                } else if (typeof this.minimum === 'number') {
                    // more than equal minimum
                    expression = `${expression}{${this.minimum},}`;
                } else if (typeof this.maximum === 'number') {
                    // more than equal 1, less thean equal maximum
                    expression = `${expression}{1,${this.maximum}}`;
                }

                return expression;
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

        // TODO : if there are too many capturing groups, so? need to test.
        return [...str.matchAll(regExp)].at(0)?.at(1) ?? null;
    }
}
