import { z } from 'zod';
import type { UserProfileInsert, UserProfileUpdate } from '../types/profile';

/**
 * Username validation: 3-30 characters, alphanumeric + underscore only
 * Matches database constraint: length(username) >= 3 AND length(username) <= 30 AND username ~ '^[a-zA-Z0-9_]+$'
 */
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be no more than 30 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )
  .nullable()
  .optional();

/**
 * Display name validation: max 100 characters
 * Matches database constraint: length(display_name) <= 100
 */
const displayNameSchema = z
  .string()
  .max(100, 'Display name must be no more than 100 characters')
  .nullable()
  .optional();

/**
 * Bio validation: max 500 characters
 * Matches database constraint: length(bio) <= 500
 */
const bioSchema = z
  .string()
  .max(500, 'Bio must be no more than 500 characters')
  .nullable()
  .optional();

/**
 * Website validation: must be a valid HTTP/HTTPS URL
 * Matches database constraint: website ~ '^https?://[^\s/$.?#].[^\s]*$'
 */
const websiteSchema = z
  .string()
  .url('Website must be a valid URL')
  .refine(
    url => /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url),
    'Website must start with http:// or https://'
  )
  .nullable()
  .optional();

/**
 * Avatar URL validation: must be a valid URL or null
 */
const avatarUrlSchema = z
  .string()
  .url('Avatar URL must be a valid URL')
  .nullable()
  .optional();

/**
 * Location validation: free text field
 */
const locationSchema = z.string().nullable().optional();

/**
 * Schema for creating a new profile
 * All fields are optional except user_id (which is provided by the hook)
 */
export const profileInsertSchema = z.object({
  username: usernameSchema,
  display_name: displayNameSchema,
  bio: bioSchema,
  avatar_url: avatarUrlSchema,
  website: websiteSchema,
  location: locationSchema,
});

/**
 * Schema for updating an existing profile
 * All fields are optional
 */
export const profileUpdateSchema = z.object({
  username: usernameSchema,
  display_name: displayNameSchema,
  bio: bioSchema,
  avatar_url: avatarUrlSchema,
  website: websiteSchema,
  location: locationSchema,
});

/**
 * Schema for profile form data (used in UI forms)
 * This allows empty strings which will be converted to null for database
 * All fields are optional and can be empty strings
 */
export const profileFormSchema = z.object({
  username: z
    .string()
    .refine(
      val =>
        !val ||
        val.trim() === '' ||
        (val.length >= 3 && val.length <= 30 && /^[a-zA-Z0-9_]+$/.test(val)),
      'Username must be 3-30 characters and contain only letters, numbers, and underscores'
    )
    .optional(),
  display_name: z
    .string()
    .refine(
      val => !val || val.trim() === '' || val.length <= 100,
      'Display name must be no more than 100 characters'
    )
    .optional(),
  bio: z
    .string()
    .refine(
      val => !val || val.trim() === '' || val.length <= 500,
      'Bio must be no more than 500 characters'
    )
    .optional(),
  website: z
    .string()
    .refine(
      val =>
        !val || val.trim() === '' || /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(val),
      'Website must be a valid URL starting with http:// or https://'
    )
    .optional(),
  location: z.string().optional(),
  avatar_url: z
    .string()
    .refine(
      val =>
        !val || val.trim() === '' || z.string().url().safeParse(val).success,
      'Avatar URL must be a valid URL'
    )
    .optional(),
});

// Type inference from schemas
export type ProfileInsertInput = z.infer<typeof profileInsertSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ProfileFormInput = z.infer<typeof profileFormSchema>;

/**
 * Helper function to transform form data to database input
 * Converts empty strings to null as expected by the database
 * Ensures all properties are explicitly set (not undefined) for exactOptionalPropertyTypes
 */
export function transformFormToInsert(
  formData: ProfileFormInput
): UserProfileInsert {
  const result: UserProfileInsert = {
    username:
      formData.username && formData.username.trim() !== ''
        ? formData.username.trim()
        : null,
    display_name:
      formData.display_name && formData.display_name.trim() !== ''
        ? formData.display_name.trim()
        : null,
    bio:
      formData.bio && formData.bio.trim() !== '' ? formData.bio.trim() : null,
    website:
      formData.website && formData.website.trim() !== ''
        ? formData.website.trim()
        : null,
    location:
      formData.location && formData.location.trim() !== ''
        ? formData.location.trim()
        : null,
    avatar_url:
      formData.avatar_url && formData.avatar_url.trim() !== ''
        ? formData.avatar_url.trim()
        : null,
  };
  return result;
}

/**
 * Helper function to transform form data to update input
 * Converts empty strings to null as expected by the database
 * Ensures all properties are explicitly set (not undefined) for exactOptionalPropertyTypes
 */
export function transformFormToUpdate(
  formData: ProfileFormInput
): UserProfileUpdate {
  const result: UserProfileUpdate = {
    username:
      formData.username && formData.username.trim() !== ''
        ? formData.username.trim()
        : null,
    display_name:
      formData.display_name && formData.display_name.trim() !== ''
        ? formData.display_name.trim()
        : null,
    bio:
      formData.bio && formData.bio.trim() !== '' ? formData.bio.trim() : null,
    website:
      formData.website && formData.website.trim() !== ''
        ? formData.website.trim()
        : null,
    location:
      formData.location && formData.location.trim() !== ''
        ? formData.location.trim()
        : null,
    avatar_url:
      formData.avatar_url && formData.avatar_url.trim() !== ''
        ? formData.avatar_url.trim()
        : null,
  };
  return result;
}
