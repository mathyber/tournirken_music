export const ACCESS_TOKEN = 'accessToken';
export const COUNT_ITEMS = 10;

export const statuses = [
    {
        name: 'NEW',
        next: ['REJECTED', 'VERIFIED', 'ACCEPTED']
    },
    {
        name: 'REJECTED',
        next: []
    },
    {
        name: 'VERIFIED',
        next: ['REJECTED', 'ACCEPTED']
    },
    {
        name: 'DSQ',
        next: []
    },
    {
        name: 'ACCEPTED',
        next: ['REJECTED', 'VERIFIED']
    },
    {
        name: 'IN_CONTEST',
        next: ['DSQ']
    },
]
