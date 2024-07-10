

enum FundRaiserCreatedBy {
    ADMIN,
    ORGANIZATION,
    USER
}


enum FundRaiserStatus {
    INITIATED,
    APPROVED,
    HOLD,
    REJECTED,
    CLOSED
}

export { FundRaiserCreatedBy, FundRaiserStatus }