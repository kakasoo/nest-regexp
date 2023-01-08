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
                    this.lookbehind(partial);
                } else {
                    this.lookaround(partial);
                }

                return this;
            }

            /**
             * Generates a regular expression instance based on what has been set up so far.
             * @returns RegExp (default flag is 'ig')
             */
            getOne() {
                return new RegExp(this.expression, 'ig');
            }

            /**
             * @param partial lookaround(?=) string
             */
            private lookaround(partial: string) {
                const symbol = '?=';
                this.expression = `(${this.expression})(${symbol}(${partial}))`;
            }

            /**
             *
             * @param partial lookbehind(?<=) string
             */
            private lookbehind(partial: string) {
                const symbol = '?<=';
                this.expression = `(${symbol}(${partial}))(${this.expression})`;
            }
        })(startString);
    }

    private getExactMatched(str: string, regExp: RegExp) {
        return [...str.matchAll(regExp)].at(0)?.at(1) ?? null;
    }
}
