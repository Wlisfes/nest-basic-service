import { I18nContext, i18nValidationMessage } from 'nestjs-i18n'
import { I18nTranslations } from '@/i18n/i18n.interface'

export function usuCurrent(): I18nContext<I18nTranslations> {
	return I18nContext.current<I18nTranslations>()
}

export const at = i18nValidationMessage<I18nTranslations>
