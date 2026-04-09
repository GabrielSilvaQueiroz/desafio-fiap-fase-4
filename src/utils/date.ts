type TimestampCarrier = {
  createdAt?: string;
  updatedAt?: string;
  createAt?: string;
  updateAt?: string;
};

export function getEntityTimestamp(entity?: TimestampCarrier | null) {
  return entity?.updatedAt ?? entity?.updateAt ?? entity?.createdAt ?? entity?.createAt ?? null;
}

export function formatDateLabel(value?: string | null) {
  if (!value) {
    return 'Sem data informada';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Data indisponivel';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

export function getExcerpt(content: string, maxLength = 120) {
  if (content.length <= maxLength) {
    return content;
  }

  return `${content.slice(0, maxLength).trim()}...`;
}
