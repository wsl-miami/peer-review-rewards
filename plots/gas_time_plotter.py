# -*- coding: utf-8 -*-
import sys
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from collections import OrderedDict
"""
This python script is used to generate various plots based on both gas prices for smart contract functions
and the latency time for calling the smart contract functions and ifps functions.
There are three flags that can be used --static, --load, or --box.
A sample command 'Command format: python3 gas_time_plotter.py --flag filename',
use TXT file for --static or --load, CSV file for --box
"""

# parse the text file output for the foundry gas report for static load size, takes txt file from foundry output
def parse_gas(filename):
    # set lines to be skipped, remove unnecessary information
    if "rrt_and" in filename:
        skipLines = 8
    elif "review" in filename:
        skipLines = 8
    else:
        skipLines = 10

    # set the output filename and open the given file
    outfile_name = filename[:-4:] + ".csv"
    df = pd.DataFrame(columns=["FunctionName", "Minimum", "Average", "Median", "Max", "#Calls"])
    if "rr_and_sbt_var" in filename:
        df = pd.DataFrame(columns=["FunctionName", "3 tokens", "10 tokens", "20 tokens", "30 tokens", "#Calls"])
    with open(filename, 'r', encoding="utf-8") as in_file:
        i = 0

        # loop through the lines
        for line in in_file:
            # if still in skipped lines continue
            if i < skipLines:
                i += 1
                continue

            # if it is a line with values replace the special chars and write to file
            if line.startswith("â") or line.startswith("│") or line.startswith("|"):
                if "Œâ" in line or '”€' in line or "-" in line:
                    continue
                line = line.replace("â", " ").replace("|", ",").replace("┆", ",").replace(" ", "").strip(',')
                line_arr = line[0:-2:].split(",")
                print(line_arr)
                row = [line_arr[0], line_arr[1], line_arr[2], line_arr[3], line_arr[4], line_arr[5]]
                df.loc[len(df)] = row
    

    plot_static(outfile_name, df)


# create csv to be used for loaded gas costs
def parse_load(filename):
    if "rrt_and" in filename:
        data_dict = {"addAdmin": {}, "revokeAdmin": {}, "singleMintFRT": {}, "bulkMintFRT": {}, "balanceOf": {}, "transfer": {}, "bulkMintSBT": {},"singleMintSBT": {}, "getTokensOwned": {}, "tokenURISBT": {}}
    elif "review" in filename:
        data_dict = {"addAdmin": {}, "revokeAdmin": {}, "individualMint": {}, "bulkMint": {}}
    else:
        data_dict = {"addAdmin": {}, "addAmbulance": {}, "addHospital": {}, "addInitiator": {}, "isAdmin": {}, "isAmbulance": {},
                 "isHospital": {}, "isInitiator": {}, "removeAdmin": {}, "removeAmbulance": {}, "removeHospital": {}, "removeInitiator": {}}
    
    # open the file and get all the lines
    with open(filename, 'r', encoding="utf-8") as in_file:
        lines_arr = in_file.readlines()

        lineCnt = 0
        # loop through the lines in teh array
        for line in lines_arr:
            if not line.startswith("|"):
                lineCnt = 0
                continue
        
            if line.startswith("|"):
                lineCnt += 1
                if lineCnt <= 5:
                    continue

                line = line.replace("\n", "").replace(" ", "").replace("|", ",").strip(",")

                # get information from the line
                line_arr = line.split(",")
                func = line_arr[0].strip()
                avg1 = line_arr[2]
                times = line_arr[5].strip()

                # if function is not in the dict continue
                if func not in data_dict.keys():
                    continue

                # add the times to the dict
                if times == "1":
                    data_dict[func]["1_avg"] = avg1.strip()
                elif times == "20":
                    data_dict[func]["20_avg"] = avg1.strip()
                elif times == "100":
                    data_dict[func]["100_avg"] = avg1.strip()
                elif times == "200":
                    data_dict[func]["200_avg"] = avg1.strip()
                elif times == "500":
                    data_dict[func]["500_avg"] = avg1.strip()
                continue
    df = pd.DataFrame(columns=['function', "1", "20", "100", "500"])

    # df = pd.DataFrame(columns=['function', "1", "20", "100", "500"])
    # get the output file name
    outfile_name = filename[:-4:].strip()

    # loop through the dictionary to write the values a dataframe
    for key, value in data_dict.items():
        if "1_avg" not in value.keys() or "20_avg" not in value.keys() or "100_avg" not in value.keys() or "500_avg" not in value.keys():
        #or "500_avg" not in value.keys():
            print("missing value for " + key)
        else: 
            row = [key, value["1_avg"], value["20_avg"], value["100_avg"], value["500_avg"]]
            # row = [key, value["1_avg"], value["20_avg"], value["100_avg"], value["500_avg"]]
            df.loc[len(df)] = row

    plot_load(outfile_name, df)


# plot the static functions, takes csv file generated by parse_static
def plot_static(filename, df):
    # get function and gas attributes
    function_name = [str.strip() for str in list(df.iloc[:,0]) ]
    min_gas = [eval(i) for i in list(df.iloc[:,1])]
    avg_gas = [eval(i) for i in list(df.iloc[:,2])]
    med_gas = [eval(i) for i in list(df.iloc[:,3])]
    max_gas = [eval(i) for i in list(df.iloc[:,4])]

    # set number of x-axis labels and width of each bar
    x = np.arange(len(function_name))
    width = 0.1

    # generate subplots and set height/width
    fig, ax = plt.subplots()
    fig.set_figwidth(5)
    fig.set_figheight(4)

    # plot the bars
    # ax.bar(x-width, min_gas, width, color='thistle', edgecolor='black', hatch='/')
    # ax.bar(x, max_gas, width, color='springgreen', edgecolor='black', hatch='o')
    # ax.bar(x+width, med_gas, width, color='salmon', edgecolor='black', hatch='-')
    # ax.bar(x+2*width, avg_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    ax.bar(x-width, min_gas, width, color='thistle', edgecolor='black', hatch='/')
    ax.bar(x, avg_gas, width, color='springgreen', edgecolor='black', hatch='o')
    ax.bar(x+width, med_gas, width, color='salmon', edgecolor='black', hatch='-')
    ax.bar(x+2*width, max_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    # plot attributes
    # ax.legend(['minimum', 'maximum', 'median', 'average'], loc='upper right')
    # if "rr_and_sbt_var" in filename:
    ax.legend(['3 tokens', '10 tokens', '20 tokens', '30 tokens'], loc='upper left')
    # ax.set_title("Gas report for Smart Contract (500 calls each)")
    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart contract methods associated with bulk minting")
    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()
    plt.yscale('log')

    # save the file
    pic_filename = filename[:-4:] + ".eps"
    plt.savefig(pic_filename, format="eps", dpi=1200)
    plt.show()


# plot the loaded functions compiled, generated from csv version of load gas prices using foundry
def plot_load(filename, df):
    # get the functions and their gas prices
    function_name = [str.strip() for str in list(df.iloc[:, 0])]
    one_gas = [eval(i) for i in list(df.iloc[:, 1])]
    twenty_gas = [eval(i) for i in list(df.iloc[:, 2])]
    hund_gas = [eval(i) for i in list(df.iloc[:, 3])]
    # twohund_gas = [eval(i) for i in list(df.iloc[:, 4])]
    fivehund_gas = [eval(i) for i in list(df.iloc[:, 4])]

    # set the number of bars needed and the width of each bar
    x = np.arange(len(function_name))
    width = 0.17

   

    # create the subplots
    fig, ax = plt.subplots()

    # set figure size
    fig.set_figwidth(5)
    fig.set_figheight(4)

    # plot the individual bars for eacch gas amount
    ax.bar(x - 2*width, one_gas, width, color='thistle', edgecolor='black', hatch='/')
    ax.bar(x - width, twenty_gas, width, color='springgreen', edgecolor='black', hatch='o')
    ax.bar(x, hund_gas, width, color='salmon', edgecolor='black', hatch='-')
    ax.bar(x + width, fivehund_gas, width, color='blue', edgecolor='black', hatch='+')
    # ax.bar(x + 2 * width, fivehund_gas, width, color='lightseagreen', edgecolor='black', hatch='\\')

    # plot attributes
    # ax.legend(['1', '20', '100', '200', '500'], loc='upper right')
    ax.legend(['1', '20', '100', '500'], loc='upper right')

    ax.set_ylabel("Gas consumed in GWEI (log-scale)")
    ax.set_xlabel("Smart Contract Method")

    plt.yscale("log")
    ax.set_xticks(x, function_name, rotation=45, ha='right')
    fig.tight_layout()

    # save the figure as vectorized image
    plt_filename = filename + ".eps"
    plt.savefig(plt_filename, format="eps", dpi=1200)
    plt.show()


# create a boxplot for API latency times from given CSV file generated by truffle tests (ran w/ --box flag)
def plot_box(filename):
    # open the file and create pandas dataframe
    data = pd.read_csv(filename)
    df = pd.DataFrame(data)

    # generate the boxplot
    df.boxplot(figsize=(5, 4), showfliers=True)

    # plot attributes
    plt.xticks(rotation=45, ha='right')

    # plt.xlabel("IPFS File Transfer Functions")
    plt.ylabel("Latency Time (ms)")
    plt.xlabel("Smart Contract Methods")

    plt.grid(visible=False)

    # save the figure as a vectorized image for quality
    plt_filename = filename[:-4:] + ".eps"
    plt.tight_layout()
    # plt.yscale('log')

    plt.savefig(plt_filename, format="eps", dpi=1200)
    plt.show()
    

# if it is the load text run load function else run standard gas function
if sys.argv[1] == "--static":
    parse_gas(sys.argv[2])
elif sys.argv[1] == "--load":
    parse_load(sys.argv[2])

elif sys.argv[1] == "--box":
    plot_box(sys.argv[2])
else:
    print("Please specify a flag (--static, --load, or --box)")
    print("Command format: python3 gas_time_plotter.py --flag filename")
    print("TXT file for --static or --load, CSV file for --box")

