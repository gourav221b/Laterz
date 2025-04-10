export interface Task {
    id: number
    text: string
    createdAt: string
    excuses?: string[]
    alternatives?: string[]
    completed: boolean;
    level?: Level;
    tags: string[];
    category: Category;
    priority: Priority;
    due?: Date;
}

export enum Priority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

export enum Level {
    BEGINNER = "Beginner",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced",
}

export enum Category {
    WORK = "Work",
    PERSONAL = "Personal",
    STUDY = "Study",
    HEALTH = "Health",
    FINANCE = "Finance",
    HOME = "Home",
    OTHER = "Other"
}
  