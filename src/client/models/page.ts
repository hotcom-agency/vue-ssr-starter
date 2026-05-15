import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'

export enum EPageSlug { 'test-page' }

/**
 * Page class
 */
export class Page {
  @Expose()
  @Type(() => String)
  public slug!: keyof typeof EPageSlug

  @Expose()
  @Type(() => String)
  public title!: string

  @Expose()
  @Type(() => String)
  public description?: string

  @Expose()
  @Type(() => String)
  public content?: string

  @Expose()
  @Type(() => String)
  public seo_title?: string

  @Expose()
  @Type(() => String)
  public seo_description?: string
}
