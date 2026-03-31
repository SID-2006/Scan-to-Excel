from collections import OrderedDict
from typing import Any, Dict, Iterable, Tuple


class LRUCorrectionCache:
    """Small in-memory LRU cache for repeated correction lookups."""

    def __init__(self, max_size: int = 512):
        self.max_size = max(16, int(max_size))
        self._store: "OrderedDict[Tuple[str, str, str], Any]" = OrderedDict()

    def get(self, key: Tuple[str, str, str]) -> Any:
        if key not in self._store:
            return None
        self._store.move_to_end(key)
        return self._store[key]

    def set(self, key: Tuple[str, str, str], value: Any) -> None:
        self._store[key] = value
        self._store.move_to_end(key)
        if len(self._store) > self.max_size:
            self._store.popitem(last=False)

    def warmup(self, entries: Iterable[Tuple[Tuple[str, str, str], Any]]) -> None:
        for key, value in entries:
            self.set(key, value)

    def size(self) -> int:
        return len(self._store)

