import matplotlib.pyplot as plt

stats = [
    {"label": "/manuscript-submission", "mean": 426.58, "q1": 416, "med": 446, "q3": 481, "Std. Dev.": 90.21, "iqr": 65, "Min": 82, "Max": 511, "whislo": 318.5, "whishi": 578.5, "fliers": [82, 246]}, 
    {"label": "/get-assigned-reviewers", "mean": 20.6, "q1": 16, "med": 20, "q3": 25, "Std. Dev.": 5.45, "iqr": 9, "Min": 12, "Max": 30, "whislo": 2.5, "whishi": 38.5, "fliers": []}, 
    {"label": "/add-reviewers", "mean": 673.08, "q1": 367, "med": 663, "q3": 982, "Std. Dev.": 354.69, "iqr": 615, "Min": 71, "Max": 1276, "whislo": -555.5, "whishi": 1904.5, "fliers": []}, 
    {"label": "/get-manuscripts-by-author", "mean": 77.1, "q1": 73, "med": 77, "q3": 81, "Std. Dev.": 3.66, "iqr": 8, "Min": 73, "Max": 83, "whislo": 61, "whishi": 93, "fliers": []}, 
    {"label": "/get-manuscripts-by-reviewer", "mean": 18.4, "q1": 14, "med": 17, "q3": 22, "Std. Dev.": 4.81, "iqr": 8, "Min": 13, "Max": 28, "whislo": 2, "whishi": 34, "fliers": []}, 
    {"label": "/review-submission", "mean": 2481.16, "q1": 2180, "med": 2479, "q3": 2785, "Std. Dev.": 352.55, "iqr": 605, "Min": 1877, "Max": 3071, "whislo": 1272.5, "whishi": 3692.5, "fliers": []}, 
    {"label": "/get-manuscripts-by-journal", "mean": 25.58, "q1": 20, "med": 27, "q3": 31, "Std. Dev.": 5.55, "iqr": 11, "Min": 16, "Max": 35, "whislo": 3.5, "whishi": 47.5, "fliers": []}, 
    {"label": "/get-token-settings", "mean": 17.3, "q1": 13, "med": 16, "q3": 22, "Std. Dev.": 4.57, "iqr": 9, "Min": 12, "Max": 25, "whislo": -0.5, "whishi": 35.5, "fliers": []}, 
    {"label": "/update-review-settings", "mean": 964.76, "q1": 657, "med": 956, "q3": 1268, "Std. Dev.": 351.42, "iqr": 611, "Min": 372, "Max": 1561, "whislo": -259.5, "whishi": 2184.5, "fliers": []}, 
    {"label": "/get-journals", "mean": 153.53, "q1": 98, "med": 166, "q3": 171, "Std. Dev.": 51.97, "iqr": 73, "Min": 93, "Max": 240, "whislo": -11.5, "whishi": 280.5, "fliers": []}, 
    {"label": "/get-reviewers", "mean": 146.5, "q1": 91, "med": 156, "q3": 167, "Std. Dev.": 52.34, "iqr": 76, "Min": 85, "Max": 233, "whislo": -23, "whishi": 281, "fliers": []}, 
    {"label": "/get-journal-detail", "mean": 15.9, "q1": 12, "med": 16, "q3": 19, "Std. Dev.": 3.37, "iqr": 7, "Min": 12, "Max": 23, "whislo": 1.5, "whishi": 29.5, "fliers": []}, 
    {"label": "/update-decision-status", "mean": 678.76, "q1": 366, "med": 664, "q3": 992, "Std. Dev.": 359.39, "iqr": 626, "Min": 73, "Max": 1285, "whislo": -573, "whishi": 1931, "fliers": []}
        ]

stats_get = [
    # {"label": "/manuscript-submission", "mean": 426.58, "q1": 416, "med": 446, "q3": 481, "Std. Dev.": 90.21, "iqr": 65, "Min": 82, "Max": 511, "whislo": 318.5, "whishi": 578.5, "fliers": [82, 246]}, 
    {"label": "/get-assigned-reviewers", "mean": 20.6, "q1": 16, "med": 20, "q3": 25, "Std. Dev.": 5.45, "iqr": 9, "Min": 12, "Max": 30, "whislo": 2.5, "whishi": 38.5, "fliers": []}, 
    # {"label": "/add-reviewers", "mean": 673.08, "q1": 367, "med": 663, "q3": 982, "Std. Dev.": 354.69, "iqr": 615, "Min": 71, "Max": 1276, "whislo": -555.5, "whishi": 1904.5, "fliers": []}, 
    {"label": "/get-manuscripts-by-author", "mean": 77.1, "q1": 73, "med": 77, "q3": 81, "Std. Dev.": 3.66, "iqr": 8, "Min": 73, "Max": 83, "whislo": 61, "whishi": 93, "fliers": []}, 
    {"label": "/get-manuscripts-by-reviewer", "mean": 18.4, "q1": 14, "med": 17, "q3": 22, "Std. Dev.": 4.81, "iqr": 8, "Min": 13, "Max": 28, "whislo": 2, "whishi": 34, "fliers": []}, 
    # {"label": "/review-submission", "mean": 2481.16, "q1": 2180, "med": 2479, "q3": 2785, "Std. Dev.": 352.55, "iqr": 605, "Min": 1877, "Max": 3071, "whislo": 1272.5, "whishi": 3692.5, "fliers": []}, 
    {"label": "/get-manuscripts-by-journal", "mean": 25.58, "q1": 20, "med": 27, "q3": 31, "Std. Dev.": 5.55, "iqr": 11, "Min": 16, "Max": 35, "whislo": 3.5, "whishi": 47.5, "fliers": []}, 
    {"label": "/get-token-settings", "mean": 17.3, "q1": 13, "med": 16, "q3": 22, "Std. Dev.": 4.57, "iqr": 9, "Min": 12, "Max": 25, "whislo": -0.5, "whishi": 35.5, "fliers": []}, 
    # {"label": "/update-review-settings", "mean": 964.76, "q1": 657, "med": 956, "q3": 1268, "Std. Dev.": 351.42, "iqr": 611, "Min": 372, "Max": 1561, "whislo": -259.5, "whishi": 2184.5, "fliers": []}, 
    {"label": "/get-journals", "mean": 153.53, "q1": 98, "med": 166, "q3": 171, "Std. Dev.": 51.97, "iqr": 73, "Min": 93, "Max": 240, "whislo": -11.5, "whishi": 280.5, "fliers": []}, 
    {"label": "/get-reviewers", "mean": 146.5, "q1": 91, "med": 156, "q3": 167, "Std. Dev.": 52.34, "iqr": 76, "Min": 85, "Max": 233, "whislo": -23, "whishi": 281, "fliers": []}, 
    {"label": "/get-journal-detail", "mean": 15.9, "q1": 12, "med": 16, "q3": 19, "Std. Dev.": 3.37, "iqr": 7, "Min": 12, "Max": 23, "whislo": 1.5, "whishi": 29.5, "fliers": []}, 
    # {"label": "/update-decision-status", "mean": 678.76, "q1": 366, "med": 664, "q3": 992, "Std. Dev.": 359.39, "iqr": 626, "Min": 73, "Max": 1285, "whislo": -573, "whishi": 1931, "fliers": []}
        ]

stats_post = [
    {"label": "/manuscript-submission", "mean": 426.58, "q1": 416, "med": 446, "q3": 481, "Std. Dev.": 90.21, "iqr": 65, "Min": 82, "Max": 511, "whislo": 318.5, "whishi": 578.5, "fliers": [82, 246]}, 
    # {"label": "/get-assigned-reviewers", "mean": 20.6, "q1": 16, "med": 20, "q3": 25, "Std. Dev.": 5.45, "iqr": 9, "Min": 12, "Max": 30, "whislo": 2.5, "whishi": 38.5, "fliers": []}, 
    {"label": "/add-reviewers", "mean": 673.08, "q1": 367, "med": 663, "q3": 982, "Std. Dev.": 354.69, "iqr": 615, "Min": 71, "Max": 1276, "whislo": -555.5, "whishi": 1904.5, "fliers": []}, 
    # {"label": "/get-manuscripts-by-author", "mean": 77.1, "q1": 73, "med": 77, "q3": 81, "Std. Dev.": 3.66, "iqr": 8, "Min": 73, "Max": 83, "whislo": 61, "whishi": 93, "fliers": []}, 
    # {"label": "/get-manuscripts-by-reviewer", "mean": 18.4, "q1": 14, "med": 17, "q3": 22, "Std. Dev.": 4.81, "iqr": 8, "Min": 13, "Max": 28, "whislo": 2, "whishi": 34, "fliers": []}, 
    {"label": "/review-submission", "mean": 2481.16, "q1": 2180, "med": 2479, "q3": 2785, "Std. Dev.": 352.55, "iqr": 605, "Min": 1877, "Max": 3071, "whislo": 1272.5, "whishi": 3692.5, "fliers": []}, 
    # {"label": "/get-manuscripts-by-journal", "mean": 25.58, "q1": 20, "med": 27, "q3": 31, "Std. Dev.": 5.55, "iqr": 11, "Min": 16, "Max": 35, "whislo": 3.5, "whishi": 47.5, "fliers": []}, 
    # {"label": "/get-token-settings", "mean": 17.3, "q1": 13, "med": 16, "q3": 22, "Std. Dev.": 4.57, "iqr": 9, "Min": 12, "Max": 25, "whislo": -0.5, "whishi": 35.5, "fliers": []}, 
    {"label": "/update-review-settings", "mean": 964.76, "q1": 657, "med": 956, "q3": 1268, "Std. Dev.": 351.42, "iqr": 611, "Min": 372, "Max": 1561, "whislo": -259.5, "whishi": 2184.5, "fliers": []}, 
    # {"label": "/get-journals", "mean": 153.53, "q1": 98, "med": 166, "q3": 171, "Std. Dev.": 51.97, "iqr": 73, "Min": 93, "Max": 240, "whislo": -11.5, "whishi": 280.5, "fliers": []}, 
    # {"label": "/get-reviewers", "mean": 146.5, "q1": 91, "med": 156, "q3": 167, "Std. Dev.": 52.34, "iqr": 76, "Min": 85, "Max": 233, "whislo": -23, "whishi": 281, "fliers": []}, 
    # {"label": "/get-journal-detail", "mean": 15.9, "q1": 12, "med": 16, "q3": 19, "Std. Dev.": 3.37, "iqr": 7, "Min": 12, "Max": 23, "whislo": 1.5, "whishi": 29.5, "fliers": []}, 
    {"label": "/update-decision-status", "mean": 678.76, "q1": 366, "med": 664, "q3": 992, "Std. Dev.": 359.39, "iqr": 626, "Min": 73, "Max": 1285, "whislo": -573, "whishi": 1931, "fliers": []}
        ]


_, ax = plt.subplots()
# ax.bxp(stats_get, showfliers=True)
# # plt.show()

# # plot attributes
# plt.xticks(rotation=45, ha='right')
# plt.xlabel("GET requests for database related API calls")
# plt.ylabel("Latency Time (ms)")
# plt.grid(visible=False)

# # save the figure as a vectorized image for quality
# plt_filename = "db_latency_get_box_plot.eps"
# plt.tight_layout()
# plt.savefig(plt_filename, format="eps", dpi=1200)
# plt.show()

ax.bxp(stats, showfliers=True)
plt.xticks(rotation=45, ha='right')
plt.xlabel("GET and POST requests for database related API calls")
plt.ylabel("Latency Time (ms)")
plt.grid(visible=False)
# plt.figure(figsize=(5, 4))
plt_filename = "box/db_latency_box_plot.eps"
plt.tight_layout()

plt.savefig(plt_filename, format="eps", dpi=1200)
plt.show()