import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiDefinitions = {
    info: {
      title: "College Management System API",
      version: "1.0.0",
      description: "API for managing colleges, users, forms, and submissions",
      timestamp: new Date().toISOString(),
    },
    baseUrl: request.nextUrl.origin + "/api",
    endpoints: {
      // System Health Routes
      health: {
        "/health": {
          method: "GET",
          description:
            "Basic system health check with database connectivity and basic stats",
          response:
            "Health status, response time, database status, and basic statistics",
        },
        "/health/detailed": {
          method: "GET",
          description:
            "Detailed system health check with comprehensive statistics and recent activity",
          response:
            "Detailed health status, database performance, user/college/form statistics, recent activity, and system information",
        },
      },

      // User Routes
      users: {
        "/users": {
          method: "GET",
          description: "Get users with optional college filter",
          parameters: "?collegeId=string",
          response: "List of users with college information",
        },
        "/users (POST)": {
          method: "POST",
          description: "Create a new user",
          body: "{ email, name?, userType?, collegeId? }",
          response: "Created user with college info",
        },
        "/users/[id]": {
          method: "GET",
          description: "Get specific user by ID",
          response: "User details with college and created colleges",
        },
        "/users/[id] (PUT)": {
          method: "PUT",
          description: "Update user information",
          body: "{ email?, name?, userType?, collegeId? }",
          response: "Updated user with college info",
        },
        "/users/[id] (DELETE)": {
          method: "DELETE",
          description: "Delete a user",
          response: "Success message",
        },
        "/users/all": {
          method: "GET",
          description: "Get all users with pagination support",
          parameters: "?includeCollege=boolean&page=number&limit=number",
          response: "Paginated list of all users with optional college data",
        },
        "/users/superadmins": {
          method: "GET",
          description: "Get all users with SUPERADMIN role",
          parameters: "?includeCollege=boolean",
          response: "List of super admin users with optional college data",
        },
      },

      // College Routes
      colleges: {
        "/colleges": {
          method: "GET",
          description: "Get colleges with optional filters",
          parameters: "?type=CollegeType&createdById=string",
          response: "List of colleges with users, sections, forms, and counts",
        },
        "/colleges (POST)": {
          method: "POST",
          description: "Create a new college",
          body: "{ name, slug, type, theme?, createdById?, galleryImages?, projects? }",
          response: "Created college with creator info",
        },
        "/colleges/[id]": {
          method: "GET",
          description: "Get specific college by ID",
          response:
            "College with users, sections, forms, submissions, and creator",
        },
        "/colleges/[id] (PUT)": {
          method: "PUT",
          description: "Update college information",
          body: "{ name?, slug?, type?, theme?, galleryImages?, projects? }",
          response: "Updated college with creator info",
        },
        "/colleges/[id] (DELETE)": {
          method: "DELETE",
          description: "Delete a college",
          response: "Success message",
        },
        "/colleges/slug/[slug]": {
          method: "GET",
          description: "Get college by slug",
          response: "College with users, sections, forms, and creator",
        },
        "/colleges/[id]/with-sections": {
          method: "GET",
          description: "Get college with its sections only",
          response: "College with sections ordered by order field",
        },
        "/colleges/[id]/sections": {
          method: "GET",
          description: "Get all sections for a specific college",
          response: "College info and list of sections ordered by order",
        },
        "/colleges/[id]/complete": {
          method: "GET",
          description: "Get complete college data with all relationships",
          response:
            "College with sections, forms (with fields), users, creator, and counts",
        },
        "/colleges/[id]/sections/reorder": {
          method: "PUT",
          description: "Reorder sections for a specific college",
          body: "{ sectionOrders: [{ id, order }] }",
          response: "Success message and reordered sections",
        },
        "/colleges/[id]/sections/bulk": {
          method: "POST",
          description: "Create multiple sections for a college",
          body: "{ sections: [{ title, content?, order? }] }",
          response: "Created sections",
        },
        "/colleges/[id]/sections/bulk (DELETE)": {
          method: "DELETE",
          description: "Delete multiple sections from a college",
          body: "{ sectionIds: [string] }",
          response: "Success message and deleted count",
        },
      },

      // Section Routes
      sections: {
        "/sections": {
          method: "GET",
          description: "Get sections with optional college filter",
          parameters: "?collegeId=string",
          response: "List of sections with college info ordered by order",
        },
        "/sections (POST)": {
          method: "POST",
          description: "Create a new section",
          body: "{ title, order?, content?, collegeId }",
          response: "Created section with college info",
        },
        "/sections/[id]": {
          method: "GET",
          description: "Get specific section by ID",
          response: "Section details with college info",
        },
        "/sections/[id] (PUT)": {
          method: "PUT",
          description: "Update section information",
          body: "{ title?, order?, content? }",
          response: "Updated section with college info",
        },
        "/sections/[id] (DELETE)": {
          method: "DELETE",
          description: "Delete a section",
          response: "Success message",
        },
      },

      // Form Section Routes
      formSections: {
        "/form-sections": {
          method: "GET",
          description: "Get form sections with optional college filter",
          parameters: "?collegeId=string",
          response:
            "List of form sections with college, fields, submissions, and counts",
        },
        "/form-sections (POST)": {
          method: "POST",
          description: "Create a new form section",
          body: "{ title, collegeId }",
          response: "Created form section with college and fields",
        },
        "/form-sections/[id]": {
          method: "GET",
          description: "Get specific form section by ID",
          response: "Form section with college, fields, and submissions",
        },
        "/form-sections/[id] (PUT)": {
          method: "PUT",
          description: "Update form section information",
          body: "{ title? }",
          response: "Updated form section with college and fields",
        },
        "/form-sections/[id] (DELETE)": {
          method: "DELETE",
          description: "Delete a form section",
          response: "Success message",
        },
      },

      // Form Routes (Additional)
      forms: {
        "/forms/[id]/with-fields": {
          method: "GET",
          description: "Get form with all its fields",
          response: "Form with fields ordered by order field and college info",
        },
        "/forms/[id]/submissions": {
          method: "GET",
          description: "Get all submissions for a specific form",
          parameters: "?page=number&limit=number",
          response:
            "Paginated form submissions with form fields and college info",
        },
        "/forms/[id]/submit": {
          method: "POST",
          description: "Submit a form",
          body: "{ data }",
          response:
            "Created form submission with form section (including fields) and college info",
        },
        "/forms/all": {
          method: "GET",
          description: "Get all forms with optional college filter",
          parameters: "?collegeId=string&page=number&limit=number",
          response:
            "Paginated list of forms with college info and field/submission counts",
        },
        "/forms/all-with-fields": {
          method: "GET",
          description: "Get all forms with their fields included",
          parameters: "?collegeId=string&page=number&limit=number",
          response: "Paginated list of forms with fields and submission counts",
        },
      },

      // Form Field Routes
      formFields: {
        "/form-fields": {
          method: "GET",
          description: "Get form fields with optional form section filter",
          parameters: "?formSectionId=string",
          response:
            "List of form fields with form section and college info ordered by order",
        },
        "/form-fields (POST)": {
          method: "POST",
          description: "Create a new form field",
          body: "{ label, type, isRequired?, options?, formSectionId, order? }",
          response: "Created form field with form section info",
        },
        "/form-fields/[id]": {
          method: "GET",
          description: "Get specific form field by ID",
          response: "Form field details with form section and college info",
        },
        "/form-fields/[id] (PUT)": {
          method: "PUT",
          description: "Update form field information",
          body: "{ label?, type?, isRequired?, options?, order? }",
          response: "Updated form field with form section info",
        },
        "/form-fields/[id] (DELETE)": {
          method: "DELETE",
          description: "Delete a form field",
          response: "Success message",
        },
      },

      // Form Submission Routes
      formSubmissions: {
        "/form-submissions": {
          method: "GET",
          description: "Get form submissions with optional filters",
          parameters: "?formSectionId=string&collegeId=string",
          response:
            "List of form submissions with form section (including fields) and college info",
        },
        "/form-submissions (POST)": {
          method: "POST",
          description: "Create a new form submission",
          body: "{ data, formSectionId, collegeId }",
          response:
            "Created form submission with form section (including fields) and college info",
        },
        "/form-submissions/[id]": {
          method: "GET",
          description: "Get specific form submission by ID",
          response:
            "Form submission details with form section (including fields) and college info",
        },
        "/form-submissions/[id] (DELETE)": {
          method: "DELETE",
          description: "Delete a form submission",
          response: "Success message",
        },
      },
    },

    // Data Models
    models: {
      User: {
        fields: [
          "id",
          "email",
          "name?",
          "userType",
          "collegeId?",
          "createdAt",
          "updatedAt",
        ],
        enums: { userType: ["ADMIN", "SUPERADMIN"] },
        relationships: ["college", "collegesCreated"],
      },
      College: {
        fields: [
          "id",
          "name",
          "slug",
          "type",
          "theme",
          "galleryImages",
          "projects",
          "createdById?",
          "createdAt",
          "updatedAt",
        ],
        enums: { type: ["TECHNICAL", "MEDICAL", "ARTS", "OTHER"] },
        relationships: [
          "User",
          "sections",
          "forms",
          "FormSubmission",
          "createdBy",
        ],
      },
      Section: {
        fields: [
          "id",
          "title",
          "order",
          "content",
          "collegeId",
          "createdAt",
          "updatedAt",
        ],
        relationships: ["college"],
      },
      FormSection: {
        fields: ["id", "title", "collegeId", "createdAt", "updatedAt"],
        relationships: ["college", "fields", "submissions"],
      },
      FormField: {
        fields: [
          "id",
          "label",
          "type",
          "isRequired",
          "options",
          "formSectionId",
          "order",
          "createdAt",
          "updatedAt",
        ],
        enums: {
          type: [
            "TEXT",
            "TEXTAREA",
            "EMAIL",
            "NUMBER",
            "SELECT",
            "CHECKBOX",
            "RADIO",
            "DATE",
            "FILE",
          ],
        },
        relationships: ["formSection"],
      },
      FormSubmission: {
        fields: ["id", "data", "formSectionId", "collegeId", "submittedAt"],
        relationships: ["formSection", "college"],
      },
    },

    // Response Formats
    responseFormats: {
      success: {
        singleResource: "Returns the requested resource object",
        multipleResources: "Returns array of resource objects",
        withPagination:
          "{ data: [], pagination: { page, limit, total, totalPages } }",
        withCounts:
          "Resource object with _count field containing related counts",
      },
      error: {
        badRequest: '{ error: "Error message" } (400)',
        notFound: '{ error: "Resource not found" } (404)',
        conflict: '{ error: "Conflict message" } (409)',
        serverError: '{ error: "Server error message" } (500)',
      },
    },
  };

  return NextResponse.json(apiDefinitions, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
