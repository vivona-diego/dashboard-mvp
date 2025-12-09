
import { NextRequest, NextResponse } from 'next/server';

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateStats() {
    return {
        count: getRandomInt(10, 500),
        sum: getRandomInt(1000, 50000),
        avg: getRandomInt(20, 100),
        total: getRandomInt(1000, 50000),
        pieces: getRandomInt(50, 1000),
        comparison: {
            prev: { count: getRandomInt(-20, 20), value: getRandomInt(-20, 20) },
            stack: { count: getRandomInt(-20, 20), value: getRandomInt(-20, 20) }
        }
    };
}

function generateBucketData(keys: string[]) {
    return keys.map(key => ({
        key,
        ...generateStats()
    }));
}

function generateTimeBuckets(unit: 'hour' | 'day' | 'week' | 'month' | 'year', count: number) {
    const buckets = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now);
        if (unit === 'hour') date.setHours(date.getHours() - i);
        if (unit === 'day') date.setDate(date.getDate() - i);
        if (unit === 'week') date.setDate(date.getDate() - (i * 7));
        if (unit === 'month') date.setMonth(date.getMonth() - i);
        if (unit === 'year') date.setFullYear(date.getFullYear() - i);
        
        buckets.push({
            key: date.toISOString(),
            ...generateStats()
        });
    }
    return buckets;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const bucketsParam = searchParams.get('buckets') || '';
    const requestedBuckets = bucketsParam.split(',');
    
    const aggregations: any = {};
    
    // Always provide these common buckets if requested or just generally useful
    if (requestedBuckets.includes('locations') || bucketsParam === '') {
        aggregations.locations = {
            buckets: generateBucketData(['Downtown Store', 'Uptown Store', 'Westside Hub']),
            overall: generateStats()
        };
    }
    
    if (requestedBuckets.includes('routes')) {
        aggregations.routes = {
            buckets: generateBucketData(['Main Route', 'Express Route', 'North Route', 'South Route', 'West Route']),
            overall: generateStats()
        };
    }
    
    if (requestedBuckets.includes('coupons')) {
        aggregations.coupons = {
            buckets: generateBucketData(['Summer Sale', 'New User', 'Loyalty', 'Referral']),
            overall: generateStats()
        };
    }

    // Time buckets
    if (requestedBuckets.includes('hour')) {
        aggregations.hour = {
            buckets: generateTimeBuckets('hour', 24),
            overall: generateStats()
        };
    }

    if (requestedBuckets.includes('day')) {
        aggregations.day = {
            buckets: generateTimeBuckets('day', 7),
            overall: generateStats()
        };
    }

    if (requestedBuckets.includes('week')) {
        aggregations.week = {
            buckets: generateTimeBuckets('week', 4),
            overall: generateStats()
        };
    }

    if (requestedBuckets.includes('month')) {
        aggregations.month = {
            buckets: generateTimeBuckets('month', 6),
            overall: generateStats()
        };
    }

    if (requestedBuckets.includes('year')) {
        aggregations.year = {
            buckets: generateTimeBuckets('year', 3),
            overall: generateStats()
        };
    }

    // Fallback for cases where specific buckets aren't explicitly requested but logic might need them? 
    // Actually the components explicitly request what they need. 
    // However, AverageValue requests 'locations' bucket.
    // Check for explicit empty responses if no buckets match.
    
    // Ensure at least empty structure if everything else fails for some reason
    if (Object.keys(aggregations).length === 0) {
        // Just return everything if nothing specific requested, or handle specific defaults
        aggregations.locations = { buckets: [], overall: generateStats() };
    }

    return NextResponse.json({
        aggregations,
        status: 'success'
    });
}
