import {prisma} from '../src/prismaClient'

const SeatData = [
    {
        id : 1,
        airplaneId : 2,
        row : 1,
        col : 'A',
    },
    {
        id : 2,
        airplaneId : 2,
        row : 1,
        col : 'B',
    },
    {
        id : 3,
        airplaneId : 2,
        row : 1,
        col : 'C',
    },
    {
        id : 4,
        airplaneId : 2,
        row : 1,
        col : 'D',
    },
    {
        id : 5,
        airplaneId : 2,
        row : 1,
        col : 'E',
    },
    {
        id : 6,
        airplaneId : 2,
        row : 1,
        col : 'F',
    },
      {
        id : 7,
        airplaneId : 2,
        row : 2,
        col : 'A',
    },
    {
        id : 8,
        airplaneId : 2,
        row : 2,
        col : 'B',
    },
    {
        id : 9,
        airplaneId : 2,
        row : 2,
        col : 'C',
    },
    {
        id : 10,
        airplaneId : 2,
        row : 2,
        col : 'D',
    },
    {
        id : 11,
        airplaneId : 2,
        row : 2,
        col : 'E',
    },
    {
        id : 12,
        airplaneId : 2,
        row : 2,
        col : 'F',
    }
]

async function up(){
    await Promise.all(
        SeatData.map((seat) => {
            return prisma.seat.upsert({
                where : {
                    id : seat.id
                },
                update : {},
                create : seat
            })
        })
    )
}

up().catch((e) => console.log(e));