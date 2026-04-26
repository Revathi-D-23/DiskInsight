#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    double value;
    char timestamp[32];
} LogEntry;

int binarySearch(LogEntry arr[], int l, int r, double x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m].value == x) return m;
        if (arr[m].value < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
    int count;
    double target;
    if (scanf("%d %lf", &count, &target) != 2) return 1;

    LogEntry* logs = malloc(count * sizeof(LogEntry));
    for (int i = 0; i < count; i++) {
        scanf("%lf %s", &logs[i].value, logs[i].timestamp);
    }

    int result = binarySearch(logs, 0, count - 1, target);
    if (result != -1) {
        printf("Found %.2f at timestamp %s\n", logs[result].value, logs[result].timestamp);
    } else {
        printf("Not found\n");
    }

    free(logs);
    return 0;
}
