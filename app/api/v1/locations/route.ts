
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json([
        {
            location_id: 1,
            name: 'Downtown Store',
            routes: [
                { route_id: 101, name: 'Main Route' },
                { route_id: 102, name: 'Express Route' }
            ]
        },
        {
            location_id: 2,
            name: 'Uptown Store',
            routes: [
                { route_id: 201, name: 'North Route' },
                { route_id: 202, name: 'South Route' }
            ]
        },
        {
            location_id: 3,
            name: 'Westside Hub',
            routes: [
                { route_id: 301, name: 'West Route' }
            ]
        }
    ]);
}
