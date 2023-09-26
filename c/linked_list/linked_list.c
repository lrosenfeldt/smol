#include <stdio.h>
#include <stdlib.h>

typedef struct {
  void* next;
  int value;
} LNode;

LNode* makeLNode(int value) {
  LNode* node = malloc(sizeof(LNode));
  if (NULL == node) {
    return NULL;
  }
  node->value = value;
  node->next = NULL;
  return node;
}

int append(LNode* list, int value) {
  if (NULL == list) {
    return 1;
  }
  LNode* newNode = makeLNode(value);
  if (NULL == newNode) {
    return 2;
  }

  if (list->next == NULL) {
    list->next = newNode;
    return 0;
  }

  LNode* node = list->next;
  for (; node->next != NULL; node = node->next) {}
  node->next = newNode;
  return 0;
}

int unmakeList(LNode* list) {
  if (list->next == NULL) {
    free(list);
    list = NULL;
    return 0;
  }
  LNode* node = list;
  LNode* target = node;
  while (node->next != NULL) {
    node = node->next;
    free(target);
    target = node;
  }
  free(target);
  target = NULL;
  list = NULL;
  return 0;
}

int size(LNode* list) {
  if (NULL == list) {
    return -1;
  }
  if (list->next == NULL) {
    return 0;
  }
  LNode* node = list->next;
  int count = 1;
  for (; node->next != NULL; node = node->next) {
    ++count;
  }
  return count;
}

void debugList(LNode* list) {
  if (NULL == list) {
    printf("null\n");
    return;
  }
  if (list->next == NULL) {
    printf("[]\n");
    return;
  }
  LNode* node = list;
  printf("[");
  for (; node->next != NULL; node = node->next) {
    printf("%d, ", node->value);
  }
  printf("%d]", node->value);
  return;
}

int main(void) {
  LNode* list = makeLNode(69);
  if (NULL == list) {
    printf("Lol. Null pointer.");
    return 0;
  }

  append(list, 42);
  append(list, 13);
  append(list, 1337);
  append(list, 149);
  append(list, 666);

  debugList(list);


  unmakeList(list);
  list = NULL;

  return 0;
}
