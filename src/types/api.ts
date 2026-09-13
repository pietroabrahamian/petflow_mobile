export type UserRole = "ADMIN" | "TUTOR"
export type HealthEventStatus = "AGENDADO" | "REALIZADO" | "CANCELADO"
export type CouponStatus = "DISPONIVEL" | "RESGATADO" | "UTILIZADO"

export type Page<T> = {
    content: T[]
    totalElements: number
    totalPages: number
    number: number
    size: number
    first: boolean
    last: boolean
}

export type ApiErrorResponse = {
    timestamp: string
    status: number
    error: string
    message: string
    path: string
    code?: string
    validationErrors?: Record<string, string>
    details?: Record<string, unknown>
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    token: string
    id: number
    name: string
    email: string
    role: UserRole
}

export type TutorRequest = {
    name: string
    email: string
    phone?: string
    password: string
}

export type TutorResponse = {
    id: number
    name: string
    email: string
    phone?: string
    createdAt: string
}

export type Species = {
    id: number
    name: string
    description?: string
}

export type EventType = {
    id: number
    name: string
    pointsReward: number
    category: string
}

export type PetRequest = {
    name: string
    breed?: string
    birthDate?: string
    weight?: number
    tutorId: number
    speciesId: number
}

export type Pet = {
    id: number
    name: string
    breed?: string
    birthDate?: string
    weight?: number
    speciesId: number
    createdAt: string
    tutorId: number
    tutorName: string
}

export type Clinic = {
    id: number
    name: string
    address?: string
    phone?: string
    cnpj: string
    createdAt: string
}

export type Plan = {
    id: number
    name: string
    description?: string
    price: number
    durationDays: number
    pointsPerEvent: number
    clinicId: number
    clinicName: string
}

export type SubscriptionStatus = "ATIVO" | "ENCERRADO" | "CANCELADO" | "EXPIRADO"

export type SubscriptionRequest = {
    startDate: string
    endDate?: string
    status?: SubscriptionStatus
    petId: number
    planId: number
}

export type Subscription = {
    id: number
    startDate: string
    endDate?: string
    status: SubscriptionStatus
    createdAt: string
    petId: number
    petName: string
    planId: number
    planName: string
}

export type HealthEventRequest = {
    description?: string
    eventDate: string
    status: HealthEventStatus
    petId: number
    eventTypeId: number
    clinicId?: number | null
}

export type HealthEvent = {
    id: number
    description?: string
    eventDate: string
    status: HealthEventStatus
    createdAt: string
    petId: number
    petName: string
    eventTypeId: number
    clinicId?: number
    clinicName?: string
}

export type PointHistory = {
    id: number
    points: number
    reason: string
    referenceType: string
    referenceId: number
    createdAt: string
}

export type TutorPoints = {
    tutorId: number
    tutorName: string
    totalPoints: number
    history: PointHistory[]
}

export type CouponCatalogItem = {
    id: number
    code: string
    title: string
    pointsRequired: number
    discountType: string
    discountValue: number
    expirationDate: string
    available: boolean
}

export type RedeemRequest = {
    couponId: number
}

export type Redeem = {
    id: number
    pointsUsed: number
    createdAt: string
    tutorId: number
    tutorName: string
    couponId: number
    couponCode: string
}
