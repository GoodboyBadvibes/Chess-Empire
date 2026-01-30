module.exports = [
"[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/package.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"name":"dotenv","version":"17.2.3","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","pretest":"npm run lint && npm run dts-check","test":"tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000","test:coverage":"tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"homepage":"https://github.com/motdotla/dotenv#readme","funding":"https://dotenvx.com","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@types/node":"^18.11.3","decache":"^4.6.2","sinon":"^14.0.1","standard":"^17.0.0","standard-version":"^9.5.0","tap":"^19.2.0","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}});}),
"[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/main.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const os = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
const crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const packageJson = __turbopack_context__.r("[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/package.json (json)");
const version = packageJson.version;
// Array of tips to display randomly
const TIPS = [
    '🔐 encrypt with Dotenvx: https://dotenvx.com',
    '🔐 prevent committing .env to code: https://dotenvx.com/precommit',
    '🔐 prevent building .env in docker: https://dotenvx.com/prebuild',
    '📡 add observability to secrets: https://dotenvx.com/ops',
    '👥 sync secrets across teammates & machines: https://dotenvx.com/ops',
    '🗂️ backup and recover secrets: https://dotenvx.com/ops',
    '✅ audit secrets and track compliance: https://dotenvx.com/ops',
    '🔄 add secrets lifecycle management: https://dotenvx.com/ops',
    '🔑 add access controls to secrets: https://dotenvx.com/ops',
    '🛠️  run anywhere with `dotenvx run -- yourcommand`',
    '⚙️  specify custom .env file path with { path: \'/custom/path/.env\' }',
    '⚙️  enable debug logging with { debug: true }',
    '⚙️  override existing env vars with { override: true }',
    '⚙️  suppress all logs with { quiet: true }',
    '⚙️  write to custom object with { processEnv: myObject }',
    '⚙️  load multiple .env files with { path: [\'.env.local\', \'.env\'] }'
];
// Get a random tip from the tips array
function _getRandomTip() {
    return TIPS[Math.floor(Math.random() * TIPS.length)];
}
function parseBoolean(value) {
    if (typeof value === 'string') {
        return ![
            'false',
            '0',
            'no',
            'off',
            ''
        ].includes(value.toLowerCase());
    }
    return Boolean(value);
}
function supportsAnsi() {
    return process.stdout.isTTY // && process.env.TERM !== 'dumb'
    ;
}
function dim(text) {
    return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text;
}
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
// Parse src into an Object
function parse(src) {
    const obj = {};
    // Convert buffer to string
    let lines = src.toString();
    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/mg, '\n');
    let match;
    while((match = LINE.exec(lines)) != null){
        const key = match[1];
        // Default undefined or null to empty string
        let value = match[2] || '';
        // Remove whitespace
        value = value.trim();
        // Check if double quoted
        const maybeQuote = value[0];
        // Remove surrounding quotes
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2');
        // Expand newlines if double quoted
        if (maybeQuote === '"') {
            value = value.replace(/\\n/g, '\n');
            value = value.replace(/\\r/g, '\r');
        }
        // Add to object
        obj[key] = value;
    }
    return obj;
}
function _parseVault(options) {
    options = options || {};
    const vaultPath = _vaultPath(options);
    options.path = vaultPath; // parse .env.vault
    const result = DotenvModule.configDotenv(options);
    if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = 'MISSING_DATA';
        throw err;
    }
    // handle scenario for comma separated keys - for use with key rotation
    // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
    const keys = _dotenvKey(options).split(',');
    const length = keys.length;
    let decrypted;
    for(let i = 0; i < length; i++){
        try {
            // Get full key
            const key = keys[i].trim();
            // Get instructions for decrypt
            const attrs = _instructions(result, key);
            // Decrypt
            decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
            break;
        } catch (error) {
            // last key
            if (i + 1 >= length) {
                throw error;
            }
        // try next key
        }
    }
    // Parse decrypted .env string
    return DotenvModule.parse(decrypted);
}
function _warn(message) {
    console.error(`[dotenv@${version}][WARN] ${message}`);
}
function _debug(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
}
function _log(message) {
    console.log(`[dotenv@${version}] ${message}`);
}
function _dotenvKey(options) {
    // prioritize developer directly setting options.DOTENV_KEY
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
    }
    // secondary infra already contains a DOTENV_KEY environment variable
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
    }
    // fallback to empty string
    return '';
}
function _instructions(result, dotenvKey) {
    // Parse DOTENV_KEY. Format is a URI
    let uri;
    try {
        uri = new URL(dotenvKey);
    } catch (error) {
        if (error.code === 'ERR_INVALID_URL') {
            const err = new Error('INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development');
            err.code = 'INVALID_DOTENV_KEY';
            throw err;
        }
        throw error;
    }
    // Get decrypt key
    const key = uri.password;
    if (!key) {
        const err = new Error('INVALID_DOTENV_KEY: Missing key part');
        err.code = 'INVALID_DOTENV_KEY';
        throw err;
    }
    // Get environment
    const environment = uri.searchParams.get('environment');
    if (!environment) {
        const err = new Error('INVALID_DOTENV_KEY: Missing environment part');
        err.code = 'INVALID_DOTENV_KEY';
        throw err;
    }
    // Get ciphertext payload
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION
    ;
    if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT';
        throw err;
    }
    return {
        ciphertext,
        key
    };
}
function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
            for (const filepath of options.path){
                if (fs.existsSync(filepath)) {
                    possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`;
                }
            }
        } else {
            possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`;
        }
    } else {
        possibleVaultPath = path.resolve(process.cwd(), '.env.vault');
    }
    if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
    }
    return null;
}
function _resolveHome(envPath) {
    return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath;
}
function _configVault(options) {
    const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
    const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (debug || !quiet) {
        _log('Loading env from encrypted .env.vault');
    }
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
        processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return {
        parsed
    };
}
function configDotenv(options) {
    const dotenvPath = path.resolve(process.cwd(), '.env');
    let encoding = 'utf8';
    let processEnv = process.env;
    if (options && options.processEnv != null) {
        processEnv = options.processEnv;
    }
    let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
    let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (options && options.encoding) {
        encoding = options.encoding;
    } else {
        if (debug) {
            _debug('No encoding is specified. UTF-8 is used by default');
        }
    }
    let optionPaths = [
        dotenvPath
    ] // default, look for .env
    ;
    if (options && options.path) {
        if (!Array.isArray(options.path)) {
            optionPaths = [
                _resolveHome(options.path)
            ];
        } else {
            optionPaths = []; // reset default
            for (const filepath of options.path){
                optionPaths.push(_resolveHome(filepath));
            }
        }
    }
    // Build the parsed data in a temporary object (because we need to return it).  Once we have the final
    // parsed data, we will combine it with process.env (or options.processEnv if provided).
    let lastError;
    const parsedAll = {};
    for (const path of optionPaths){
        try {
            // Specifying an encoding returns a string instead of a buffer
            const parsed = DotenvModule.parse(fs.readFileSync(path, {
                encoding
            }));
            DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
            if (debug) {
                _debug(`Failed to load ${path} ${e.message}`);
            }
            lastError = e;
        }
    }
    const populated = DotenvModule.populate(processEnv, parsedAll, options);
    // handle user settings DOTENV_CONFIG_ options inside .env file(s)
    debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
    quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
    if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths){
            try {
                const relative = path.relative(process.cwd(), filePath);
                shortPaths.push(relative);
            } catch (e) {
                if (debug) {
                    _debug(`Failed to load ${filePath} ${e.message}`);
                }
                lastError = e;
            }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(',')} ${dim(`-- tip: ${_getRandomTip()}`)}`);
    }
    if (lastError) {
        return {
            parsed: parsedAll,
            error: lastError
        };
    } else {
        return {
            parsed: parsedAll
        };
    }
}
// Populates process.env from .env file
function config(options) {
    // fallback to original dotenv if DOTENV_KEY is not set
    if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    // dotenvKey exists but .env.vault file does not exist
    if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
}
function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), 'hex');
    let ciphertext = Buffer.from(encrypted, 'base64');
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
        const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === 'Invalid key length';
        const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data';
        if (isRange || invalidKeyLength) {
            const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)');
            err.code = 'INVALID_DOTENV_KEY';
            throw err;
        } else if (decryptionFailed) {
            const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY');
            err.code = 'DECRYPTION_FAILED';
            throw err;
        } else {
            throw error;
        }
    }
}
// Populate process.env with parsed values
function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    const populated = {};
    if (typeof parsed !== 'object') {
        const err = new Error('OBJECT_REQUIRED: Please check the processEnv argument being passed to populate');
        err.code = 'OBJECT_REQUIRED';
        throw err;
    }
    // Set process.env
    for (const key of Object.keys(parsed)){
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
            if (override === true) {
                processEnv[key] = parsed[key];
                populated[key] = parsed[key];
            }
            if (debug) {
                if (override === true) {
                    _debug(`"${key}" is already defined and WAS overwritten`);
                } else {
                    _debug(`"${key}" is already defined and was NOT overwritten`);
                }
            }
        } else {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
        }
    }
    return populated;
}
const DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
};
module.exports.configDotenv = DotenvModule.configDotenv;
module.exports._configVault = DotenvModule._configVault;
module.exports._parseVault = DotenvModule._parseVault;
module.exports.config = DotenvModule.config;
module.exports.decrypt = DotenvModule.decrypt;
module.exports.parse = DotenvModule.parse;
module.exports.populate = DotenvModule.populate;
module.exports = DotenvModule;
}),
"[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/env-options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

// ../config.js accepts options via environment variables
const options = {};
if (process.env.DOTENV_CONFIG_ENCODING != null) {
    options.encoding = process.env.DOTENV_CONFIG_ENCODING;
}
if (process.env.DOTENV_CONFIG_PATH != null) {
    options.path = process.env.DOTENV_CONFIG_PATH;
}
if (process.env.DOTENV_CONFIG_QUIET != null) {
    options.quiet = process.env.DOTENV_CONFIG_QUIET;
}
if (process.env.DOTENV_CONFIG_DEBUG != null) {
    options.debug = process.env.DOTENV_CONFIG_DEBUG;
}
if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
    options.override = process.env.DOTENV_CONFIG_OVERRIDE;
}
if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
    options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
}
module.exports = options;
}),
"[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/cli-options.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
module.exports = function optionMatcher(args) {
    const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
            acc[matches[1]] = matches[2];
        }
        return acc;
    }, {});
    if (!('quiet' in options)) {
        options.quiet = 'true';
    }
    return options;
};
}),
"[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/config.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    __turbopack_context__.r("[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/main.js [app-route] (ecmascript)").config(Object.assign({}, __turbopack_context__.r("[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/env-options.js [app-route] (ecmascript)"), __turbopack_context__.r("[project]/node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/cli-options.js [app-route] (ecmascript)")(process.argv)));
})();
}),
"[externals]/pg [external] (pg, esm_import, [project]/node_modules/.pnpm/pg@8.17.2/node_modules/pg)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg-fcd9a938148691af");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/.pnpm/drizzle-zod@0.7.1_drizzle-o_6fe5651c22ba2ede9e31febd2b763a2e/node_modules/drizzle-zod/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bufferSchema",
    ()=>bufferSchema,
    "createInsertSchema",
    ()=>createInsertSchema,
    "createSchemaFactory",
    ()=>createSchemaFactory,
    "createSelectSchema",
    ()=>createSelectSchema,
    "createUpdateSchema",
    ()=>createUpdateSchema,
    "isColumnType",
    ()=>isColumnType,
    "isPgEnum",
    ()=>isPgEnum,
    "isWithEnum",
    ()=>isWithEnum,
    "jsonSchema",
    ()=>jsonSchema,
    "literalSchema",
    ()=>literalSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.39.3_@electri_05f47be2706375d7d42c2e22ad096572/node_modules/drizzle-orm/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.39.3_@electri_05f47be2706375d7d42c2e22ad096572/node_modules/drizzle-orm/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.39.3_@electri_05f47be2706375d7d42c2e22ad096572/node_modules/drizzle-orm/entity.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.39.3_@electri_05f47be2706375d7d42c2e22ad096572/node_modules/drizzle-orm/column.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.39.3_@electri_05f47be2706375d7d42c2e22ad096572/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
;
;
const CONSTANTS = {
    INT8_MIN: -128,
    INT8_MAX: 127,
    INT8_UNSIGNED_MAX: 255,
    INT16_MIN: -32768,
    INT16_MAX: 32767,
    INT16_UNSIGNED_MAX: 65535,
    INT24_MIN: -8388608,
    INT24_MAX: 8388607,
    INT24_UNSIGNED_MAX: 16777215,
    INT32_MIN: -2147483648,
    INT32_MAX: 2147483647,
    INT32_UNSIGNED_MAX: 4294967295,
    INT48_MIN: -140737488355328,
    INT48_MAX: 140737488355327,
    INT48_UNSIGNED_MAX: 281474976710655,
    INT64_MIN: -9223372036854775808n,
    INT64_MAX: 9223372036854775807n,
    INT64_UNSIGNED_MAX: 18446744073709551615n
};
function isColumnType(column, columnTypes) {
    return columnTypes.includes(column.columnType);
}
function isWithEnum(column) {
    return 'enumValues' in column && Array.isArray(column.enumValues) && column.enumValues.length > 0;
}
const isPgEnum = isWithEnum;
const literalSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean(),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].null()
]);
const jsonSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    literalSchema,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any())
]);
const bufferSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].custom((v)=>v instanceof Buffer); // eslint-disable-line no-instanceof/no-instanceof
function columnToSchema(column, factory) {
    const z$1 = factory?.zodInstance ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"];
    const coerce = factory?.coerce ?? {};
    let schema;
    if (isWithEnum(column)) {
        schema = column.enumValues.length ? z$1.enum(column.enumValues) : z$1.string();
    }
    if (!schema) {
        // Handle specific types
        if (isColumnType(column, [
            'PgGeometry',
            'PgPointTuple'
        ])) {
            schema = z$1.tuple([
                z$1.number(),
                z$1.number()
            ]);
        } else if (isColumnType(column, [
            'PgGeometryObject',
            'PgPointObject'
        ])) {
            schema = z$1.object({
                x: z$1.number(),
                y: z$1.number()
            });
        } else if (isColumnType(column, [
            'PgHalfVector',
            'PgVector'
        ])) {
            schema = z$1.array(z$1.number());
            schema = column.dimensions ? schema.length(column.dimensions) : schema;
        } else if (isColumnType(column, [
            'PgLine'
        ])) {
            schema = z$1.tuple([
                z$1.number(),
                z$1.number(),
                z$1.number()
            ]);
        } else if (isColumnType(column, [
            'PgLineABC'
        ])) {
            schema = z$1.object({
                a: z$1.number(),
                b: z$1.number(),
                c: z$1.number()
            });
        } else if (isColumnType(column, [
            'PgArray'
        ])) {
            schema = z$1.array(columnToSchema(column.baseColumn, z$1));
            schema = column.size ? schema.length(column.size) : schema;
        } else if (column.dataType === 'array') {
            schema = z$1.array(z$1.any());
        } else if (column.dataType === 'number') {
            schema = numberColumnToSchema(column, z$1, coerce);
        } else if (column.dataType === 'bigint') {
            schema = bigintColumnToSchema(column, z$1, coerce);
        } else if (column.dataType === 'boolean') {
            schema = coerce === true || coerce.boolean ? z$1.coerce.boolean() : z$1.boolean();
        } else if (column.dataType === 'date') {
            schema = coerce === true || coerce.date ? z$1.coerce.date() : z$1.date();
        } else if (column.dataType === 'string') {
            schema = stringColumnToSchema(column, z$1, coerce);
        } else if (column.dataType === 'json') {
            schema = jsonSchema;
        } else if (column.dataType === 'custom') {
            schema = z$1.any();
        } else if (column.dataType === 'buffer') {
            schema = bufferSchema;
        }
    }
    if (!schema) {
        schema = z$1.any();
    }
    return schema;
}
function numberColumnToSchema(column, z, coerce) {
    let unsigned = column.getSQLType().includes('unsigned');
    let min;
    let max;
    let integer = false;
    if (isColumnType(column, [
        'MySqlTinyInt',
        'SingleStoreTinyInt'
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT8_MIN;
        max = unsigned ? CONSTANTS.INT8_UNSIGNED_MAX : CONSTANTS.INT8_MAX;
        integer = true;
    } else if (isColumnType(column, [
        'PgSmallInt',
        'PgSmallSerial',
        'MySqlSmallInt',
        'SingleStoreSmallInt'
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT16_MIN;
        max = unsigned ? CONSTANTS.INT16_UNSIGNED_MAX : CONSTANTS.INT16_MAX;
        integer = true;
    } else if (isColumnType(column, [
        'PgReal',
        'MySqlFloat',
        'MySqlMediumInt',
        'SingleStoreMediumInt',
        'SingleStoreFloat'
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT24_MIN;
        max = unsigned ? CONSTANTS.INT24_UNSIGNED_MAX : CONSTANTS.INT24_MAX;
        integer = isColumnType(column, [
            'MySqlMediumInt',
            'SingleStoreMediumInt'
        ]);
    } else if (isColumnType(column, [
        'PgInteger',
        'PgSerial',
        'MySqlInt',
        'SingleStoreInt'
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT32_MIN;
        max = unsigned ? CONSTANTS.INT32_UNSIGNED_MAX : CONSTANTS.INT32_MAX;
        integer = true;
    } else if (isColumnType(column, [
        'PgDoublePrecision',
        'MySqlReal',
        'MySqlDouble',
        'SingleStoreReal',
        'SingleStoreDouble',
        'SQLiteReal'
    ])) {
        min = unsigned ? 0 : CONSTANTS.INT48_MIN;
        max = unsigned ? CONSTANTS.INT48_UNSIGNED_MAX : CONSTANTS.INT48_MAX;
    } else if (isColumnType(column, [
        'PgBigInt53',
        'PgBigSerial53',
        'MySqlBigInt53',
        'MySqlSerial',
        'SingleStoreBigInt53',
        'SingleStoreSerial',
        'SQLiteInteger'
    ])) {
        unsigned = unsigned || isColumnType(column, [
            'MySqlSerial',
            'SingleStoreSerial'
        ]);
        min = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
        max = Number.MAX_SAFE_INTEGER;
        integer = true;
    } else if (isColumnType(column, [
        'MySqlYear',
        'SingleStoreYear'
    ])) {
        min = 1901;
        max = 2155;
        integer = true;
    } else {
        min = Number.MIN_SAFE_INTEGER;
        max = Number.MAX_SAFE_INTEGER;
    }
    let schema = coerce === true || coerce?.number ? z.coerce.number() : z.number();
    schema = schema.min(min).max(max);
    return integer ? schema.int() : schema;
}
function bigintColumnToSchema(column, z, coerce) {
    const unsigned = column.getSQLType().includes('unsigned');
    const min = unsigned ? 0n : CONSTANTS.INT64_MIN;
    const max = unsigned ? CONSTANTS.INT64_UNSIGNED_MAX : CONSTANTS.INT64_MAX;
    const schema = coerce === true || coerce?.bigint ? z.coerce.bigint() : z.bigint();
    return schema.min(min).max(max);
}
function stringColumnToSchema(column, z, coerce) {
    if (isColumnType(column, [
        'PgUUID'
    ])) {
        return z.string().uuid();
    }
    let max;
    let regex;
    let fixed = false;
    if (isColumnType(column, [
        'PgVarchar',
        'SQLiteText'
    ])) {
        max = column.length;
    } else if (isColumnType(column, [
        'MySqlVarChar',
        'SingleStoreVarChar'
    ])) {
        max = column.length ?? CONSTANTS.INT16_UNSIGNED_MAX;
    } else if (isColumnType(column, [
        'MySqlText',
        'SingleStoreText'
    ])) {
        if (column.textType === 'longtext') {
            max = CONSTANTS.INT32_UNSIGNED_MAX;
        } else if (column.textType === 'mediumtext') {
            max = CONSTANTS.INT24_UNSIGNED_MAX;
        } else if (column.textType === 'text') {
            max = CONSTANTS.INT16_UNSIGNED_MAX;
        } else {
            max = CONSTANTS.INT8_UNSIGNED_MAX;
        }
    }
    if (isColumnType(column, [
        'PgChar',
        'MySqlChar',
        'SingleStoreChar'
    ])) {
        max = column.length;
        fixed = true;
    }
    if (isColumnType(column, [
        'PgBinaryVector'
    ])) {
        regex = /^[01]+$/;
        max = column.dimensions;
    }
    let schema = coerce === true || coerce?.string ? z.coerce.string() : z.string();
    schema = regex ? schema.regex(regex) : schema;
    return max && fixed ? schema.length(max) : max ? schema.max(max) : schema;
}
function getColumns(tableLike) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTable"])(tableLike) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTableColumns"])(tableLike) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getViewSelectedFields"])(tableLike);
}
function handleColumns(columns, refinements, conditions, factory) {
    const columnSchemas = {};
    for (const [key, selected] of Object.entries(columns)){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["is"])(selected, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Column"]) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["is"])(selected, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SQL"]) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["is"])(selected, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SQL"].Aliased) && typeof selected === 'object') {
            const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTable"])(selected) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isView"])(selected) ? getColumns(selected) : selected;
            columnSchemas[key] = handleColumns(columns, refinements[key] ?? {}, conditions, factory);
            continue;
        }
        const refinement = refinements[key];
        if (refinement !== undefined && typeof refinement !== 'function') {
            columnSchemas[key] = refinement;
            continue;
        }
        const column = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["is"])(selected, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$39$2e$3_$40$electri_05f47be2706375d7d42c2e22ad096572$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Column"]) ? selected : undefined;
        const schema = column ? columnToSchema(column, factory) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any();
        const refined = typeof refinement === 'function' ? refinement(schema) : schema;
        if (conditions.never(column)) {
            continue;
        } else {
            columnSchemas[key] = refined;
        }
        if (column) {
            if (conditions.nullable(column)) {
                columnSchemas[key] = columnSchemas[key].nullable();
            }
            if (conditions.optional(column)) {
                columnSchemas[key] = columnSchemas[key].optional();
            }
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object(columnSchemas);
}
function handleEnum(enum_, factory) {
    const zod = factory?.zodInstance ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"];
    return zod.enum(enum_.enumValues);
}
const selectConditions = {
    never: ()=>false,
    optional: ()=>false,
    nullable: (column)=>!column.notNull
};
const insertConditions = {
    never: (column)=>column?.generated?.type === 'always' || column?.generatedIdentity?.type === 'always',
    optional: (column)=>!column.notNull || column.notNull && column.hasDefault,
    nullable: (column)=>!column.notNull
};
const updateConditions = {
    never: (column)=>column?.generated?.type === 'always' || column?.generatedIdentity?.type === 'always',
    optional: ()=>true,
    nullable: (column)=>!column.notNull
};
const createSelectSchema = (entity, refine)=>{
    if (isPgEnum(entity)) {
        return handleEnum(entity);
    }
    const columns = getColumns(entity);
    return handleColumns(columns, refine ?? {}, selectConditions);
};
const createInsertSchema = (entity, refine)=>{
    const columns = getColumns(entity);
    return handleColumns(columns, refine ?? {}, insertConditions);
};
const createUpdateSchema = (entity, refine)=>{
    const columns = getColumns(entity);
    return handleColumns(columns, refine ?? {}, updateConditions);
};
function createSchemaFactory(options) {
    const createSelectSchema = (entity, refine)=>{
        if (isPgEnum(entity)) {
            return handleEnum(entity, options);
        }
        const columns = getColumns(entity);
        return handleColumns(columns, refine ?? {}, selectConditions, options);
    };
    const createInsertSchema = (entity, refine)=>{
        const columns = getColumns(entity);
        return handleColumns(columns, refine ?? {}, insertConditions, options);
    };
    const createUpdateSchema = (entity, refine)=>{
        const columns = getColumns(entity);
        return handleColumns(columns, refine ?? {}, updateConditions, options);
    };
    return {
        createSelectSchema,
        createInsertSchema,
        createUpdateSchema
    };
}
;
 //# sourceMappingURL=index.mjs.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c7caacf8._.js.map