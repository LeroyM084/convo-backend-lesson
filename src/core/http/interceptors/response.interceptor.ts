/*
#########################
#
# Ce fichier standardise toutes les reponses SUCCESS de ton API.
#
# Regle simple:
# - Peu importe ce que l'on return dans un controller/usecase:
#   return user
#   return [users]
#   return true
#
# Le front recevra TOUJOURS:
#   { data: ... }
#
# Pagination / meta:
# - Si tu veux renvoyer meta (ex: total, page):
#   return { data: items, meta: { total, page, pageSize } }
# - L'interceptor detecte que tu as deja { data, meta } et ne touche pas.
#
#########################
*/

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

type ApiSuccessBody<T = unknown> = {
  data: T;
  meta?: unknown;
};