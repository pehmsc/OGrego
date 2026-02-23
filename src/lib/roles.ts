export type UserRole = "user" | "admin";

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object"
        ? (value as Record<string, unknown>)
        : null;
}

export function normalizeUserRole(value: unknown): UserRole | null {
    if (typeof value !== "string") return null;

    const normalized = value.toLowerCase().trim();
    if (normalized === "admin") return "admin";
    if (normalized === "user") return "user";
    return null;
}

function normalizeOrgRole(value: unknown): UserRole | null {
    if (typeof value !== "string") return null;

    const normalized = value.toLowerCase().trim();
    if (normalized.includes("admin")) return "admin";
    if (normalized.includes("user") || normalized.includes("member")) {
        return "user";
    }
    return null;
}

export function getRoleFromMetadata(metadata: unknown): UserRole | null {
    const metadataRecord = asRecord(metadata);
    if (!metadataRecord) return null;
    return normalizeUserRole(metadataRecord.role);
}

type ClerkMetadataSource = {
    publicMetadata?: unknown;
    privateMetadata?: unknown;
    unsafeMetadata?: unknown;
};

export function getRoleFromClerkUserMetadata(
    source: ClerkMetadataSource | null | undefined,
): UserRole | null {
    if (!source) return null;

    return (
        getRoleFromMetadata(source.publicMetadata) ??
        getRoleFromMetadata(source.privateMetadata) ??
        getRoleFromMetadata(source.unsafeMetadata)
    );
}

export function getRoleFromSessionClaims(sessionClaims: unknown): UserRole | null {
    const claims = asRecord(sessionClaims);
    if (!claims) return null;

    return (
        normalizeUserRole(claims.role) ??
        normalizeOrgRole(claims.org_role) ??
        normalizeOrgRole(claims.orgRole) ??
        getRoleFromMetadata(claims.metadata) ??
        getRoleFromMetadata(claims.public_metadata) ??
        getRoleFromMetadata(claims.private_metadata) ??
        getRoleFromMetadata(claims.unsafe_metadata) ??
        getRoleFromClerkUserMetadata({
            publicMetadata: claims.publicMetadata,
            privateMetadata: claims.privateMetadata,
            unsafeMetadata: claims.unsafeMetadata,
        })
    );
}
