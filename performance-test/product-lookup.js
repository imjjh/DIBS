import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    discardResponseBodies: true,
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    stages: [
        // { duration: '30s', target: 100 },
        // { duration: '1m', target: 100 },
        { duration: '30s', target: 500 },
        // { duration: '1m', target: 500 },
        // { duration: '30s', target: 0 },
    ],
};

// 깃허브 보안 및 유연성을 위해 환경 변수 사용
// 실행 시 -e TARGET_URL=... 옵션으로 주입 가능
const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8080';

export default function () {
    const storeId = 1;
    const res = http.get(`${BASE_URL}/api/products/${storeId}`);

    const result = check(res, {
        'status is 200': (r) => r.status === 200,
    });

    if (!result) {
        console.log(`[Error] Status: ${res.status} | Body: ${res.body}`);
    }

}
