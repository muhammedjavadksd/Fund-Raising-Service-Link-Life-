

enum FundRaiserCreatedBy {
    ADMIN = "ADMIN",
    ORGANIZATION = "ORGANIZATION",
    USER = "USER"
}

enum FundRaiserStatus {
    INITIATED = "INITIATED",
    APPROVED = "APPROVED",
    HOLD = "HOLD",
    REJECTED = "REJECTED",
    CLOSED = "CLOSED"
}

export { FundRaiserCreatedBy, FundRaiserStatus }