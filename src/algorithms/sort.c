#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    double value;
    char timestamp[32];
} LogEntry;

void swap(LogEntry* a, LogEntry* b) {
    LogEntry t = *a;
    *a = *b;
    *b = t;
}

int partition(LogEntry arr[], int low, int high) {
    double pivot = arr[high].value;
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j].value < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(LogEntry arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main(int argc, char* argv[]) {
    // This program reads log entries (value,timestamp) and sorts them by value
    // Used for performance ranking
    int count;
    if (scanf("%d", &count) != 1) return 1;

    LogEntry* logs = malloc(count * sizeof(LogEntry));
    for (int i = 0; i < count; i++) {
        scanf("%lf %s", &logs[i].value, logs[i].timestamp);
    }

    quickSort(logs, 0, count - 1);

    printf("%d\n", count);
    for (int i = 0; i < count; i++) {
        printf("%.2f %s\n", logs[i].value, logs[i].timestamp);
    }

    free(logs);
    return 0;
}
