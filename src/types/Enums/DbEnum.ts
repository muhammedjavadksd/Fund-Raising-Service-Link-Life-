

enum FundRaiserCreatedBy {
    ADMIN = "ADMIN",
    USER = "USER"
}

enum FundRaiserStatus {
    CREATED = "CREATED",
    INITIATED = "INITIATED",
    APPROVED = "APPROVED",
    HOLD = "HOLD",
    REJECTED = "REJECTED",
    CLOSED = "CLOSED"
}


enum BankAccountType {
    Saving = "saving",
    Current = "current",
}

export { FundRaiserCreatedBy, FundRaiserStatus, BankAccountType }